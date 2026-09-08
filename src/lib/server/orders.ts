import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { CANCELABLE_STATUSES, STATUS_NOTIFY, type OrderStatus } from "@/lib/agency";
import { getSql } from "@/lib/db";
import type { Order } from "@/lib/types";
import { money } from "@/lib/utils";
import { asArr, mapHistory, mapItem, mapOrder } from "./map";
import { ensureProfile, loadProfile } from "./profile";

const placeSchema = z.object({
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(50) })).min(1),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  note: z.string().trim().max(400).optional().default(""),
  paymentMethod: z.string().min(1).max(20),
});

const ORDER_SELECT = `
  o.*, a.name as agent_name, a.phone as agent_phone, a.id as agent_id,
  p.full_name as customer_name, p.mobile as customer_mobile,
  coalesce((select json_agg(i order by i.id) from order_items i where i.order_id = o.id), '[]'::json) as items,
  coalesce((select json_agg(h order by h.created_at, h.id) from order_status_history h where h.order_id = o.id), '[]'::json) as history
`;

async function hydrate(row: Record<string, unknown>): Promise<Order> {
  return mapOrder(row, {
    items: asArr<Record<string, unknown>>(row.items).map(mapItem),
    history: asArr<Record<string, unknown>>(row.history).map(mapHistory),
  });
}

async function getOwnedOrder(userId: string, orderId: number): Promise<Order> {
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    `select ${ORDER_SELECT}
     from orders o
     left join delivery_agents a on a.id = o.assigned_agent_id
     left join profiles p on p.user_id = o.user_id
     where o.id = $1 and o.user_id = $2 limit 1`,
    [orderId, userId],
  );
  if (!rows[0]) throw new Error("Order not found");
  return hydrate(rows[0]);
}

export async function notifyCustomer(userId: string, orderId: number, orderNumber: string, status: OrderStatus) {
  const msg = STATUS_NOTIFY[status]?.(orderNumber);
  if (!msg) return;
  const sql = await getSql();
  await sql`insert into notifications (user_id, title, body, order_id) values (${userId}, ${msg.title}, ${msg.body}, ${orderId})`;
}

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Order[]> => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    const rows = await sql.query<Record<string, unknown>>(
      `select ${ORDER_SELECT}
       from orders o
       left join delivery_agents a on a.id = o.assigned_agent_id
       left join profiles p on p.user_id = o.user_id
       where o.user_id = $1 order by o.created_at desc limit 80`,
      [context.userId],
    );
    return Promise.all(rows.map(hydrate));
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.number().int().positive() }).parse(input))
  .handler(async ({ context, data }): Promise<Order> => getOwnedOrder(context.userId, data.id));

export const getCurrentDelivery = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Order | null> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `select ${ORDER_SELECT}
       from orders o
       left join delivery_agents a on a.id = o.assigned_agent_id
       left join profiles p on p.user_id = o.user_id
       where o.user_id = $1 and o.status in ('placed','confirmed','preparing','out_for_delivery')
       order by o.created_at desc limit 1`,
      [context.userId],
    );
    return rows[0] ? hydrate(rows[0]) : null;
  });

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => placeSchema.parse(input))
  .handler(async ({ context, data }): Promise<Order> => {
    const sql = await getSql();
    const profile = await loadProfile(context.userId);
    if (!profile.fullName || !profile.mobile) throw new Error("Please complete your name and mobile number before ordering.");
    if (!profile.address) throw new Error("Please save a delivery address before ordering.");

    const methods = await sql<{ id: string }>`select id from payment_methods where enabled = true`;
    if (!new Set(methods.map((m) => m.id)).has(data.paymentMethod)) throw new Error("That payment method is not available.");

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const preferred = new Date(`${data.preferredDate}T00:00:00`);
    if (Number.isNaN(preferred.getTime()) || preferred < today) throw new Error("Choose a delivery date of today or later.");

    const productIds = data.items.map((i) => i.productId);
    const allProducts = await sql<Record<string, unknown>>`select * from products where is_active = true`;
    const products = allProducts.filter((p) => productIds.includes(Number(p.id)));
    if (products.length !== productIds.length) throw new Error("One or more products are no longer available.");
    const byId = new Map(products.map((p) => [Number(p.id), p]));
    const lines = data.items.map((item) => {
      const p = byId.get(item.productId);
      if (!p) throw new Error("Product missing.");
      const unit = money(p.unit_price as string);
      return {
        productId: item.productId, name: String(p.name), sizeLabel: String(p.size_label),
        unitPrice: unit, quantity: item.quantity, lineTotal: Math.round(unit * item.quantity * 100) / 100,
      };
    });
    const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
    const addr = profile.address;
    const snapshot = JSON.stringify({
      label: addr.label, line1: addr.line1, line2: addr.line2, city: addr.city,
      state: addr.state, pincode: addr.pincode, landmark: addr.landmark,
    });
    const numRows = await sql<{ n: string }>`select nextval('order_number_seq')::text as n`;
    const orderNumber = `SUP-${numRows[0]?.n ?? "1025"}`;
    const inserted = await sql.query<{ id: number }>(
      `insert into orders (
        order_number, user_id, status, address_snapshot, preferred_date, time_slot,
        note, payment_method, payment_status, subtotal, total, expected_date
      ) values ($1,$2,'placed',$3::jsonb,$4::date,$5,$6,$7,'pending',$8,$9,$4::date) returning id`,
      [orderNumber, context.userId, snapshot, data.preferredDate, data.timeSlot, data.note ?? "", data.paymentMethod, subtotal, subtotal],
    );
    const orderId = Number(inserted[0]?.id);
    if (!orderId) throw new Error("Could not create the order.");
    for (const line of lines) {
      await sql`
        insert into order_items (order_id, product_id, product_name, size_label, unit_price, quantity, line_total)
        values (${orderId}, ${line.productId}, ${line.name}, ${line.sizeLabel}, ${line.unitPrice}, ${line.quantity}, ${line.lineTotal})
      `;
    }
    await sql`insert into order_status_history (order_id, status, note, created_by) values (${orderId}, 'placed', 'Order placed by customer', ${context.userId})`;
    await sql`insert into payments (order_id, method, amount, status) values (${orderId}, ${data.paymentMethod}, ${subtotal}, 'pending')`;
    await sql`
      insert into notifications (user_id, title, body, order_id)
      values (${context.userId}, ${`Order ${orderNumber} placed`}, ${`Your order ${orderNumber} has been placed. We will confirm it shortly.`}, ${orderId})
    `;
    return getOwnedOrder(context.userId, orderId);
  });

export const cancelMyOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.number().int().positive(), reason: z.string().trim().max(200).optional() }).parse(input))
  .handler(async ({ context, data }): Promise<Order> => {
    const existing = await getOwnedOrder(context.userId, data.id);
    if (!CANCELABLE_STATUSES.includes(existing.status as (typeof CANCELABLE_STATUSES)[number])) {
      throw new Error("This order can no longer be cancelled. Please call the agency.");
    }
    const sql = await getSql();
    await sql`
      update orders set status = 'cancelled', cancelled_at = now(),
        cancel_reason = ${data.reason ?? "Cancelled by customer"}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId} and status in ('placed', 'confirmed')
    `;
    await sql`insert into order_status_history (order_id, status, note, created_by) values (${data.id}, 'cancelled', ${data.reason ?? "Cancelled by customer"}, ${context.userId})`;
    await notifyCustomer(context.userId, data.id, existing.orderNumber, "cancelled");
    return getOwnedOrder(context.userId, data.id);
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/agency";
import { getSql } from "@/lib/db";
import { indianMobile } from "@/lib/utils";
import type { Address, AgencySettings, DeliveryAgent, Order, PaymentMethod, Product } from "@/lib/types";
import { asArr, mapAddress, mapAgent, mapHistory, mapItem, mapOrder, mapPayment, mapProduct, mapSettings, num } from "./map";
import { notifyCustomer } from "./orders";
import { requireAdmin } from "./profile";

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

export type AdminCustomer = {
  userId: string; fullName: string; mobile: string; altMobile: string; email: string | null;
  role: string; createdAt: string; orderCount: number; address: Address | null;
};

export type AdminStats = { incoming: number; outForDelivery: number; deliveredToday: number; customers: number };

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminStats> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const incoming = await sql<{ n: number }>`select count(*)::int as n from orders where status in ('placed','confirmed','preparing')`;
    const out = await sql<{ n: number }>`select count(*)::int as n from orders where status = 'out_for_delivery'`;
    const delivered = await sql<{ n: number }>`select count(*)::int as n from orders where status = 'delivered' and delivered_at::date = current_date`;
    const customers = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'customer'`;
    return { incoming: num(incoming[0]?.n), outForDelivery: num(out[0]?.n), deliveredToday: num(delivered[0]?.n), customers: num(customers[0]?.n) };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ status: z.string().optional() }).optional().parse(input ?? {}))
  .handler(async ({ context, data }): Promise<Order[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const status = data?.status && data.status !== "all" ? data.status : null;
    const rows = status
      ? await sql.query<Record<string, unknown>>(`select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id where o.status = $1 order by o.created_at desc limit 200`, [status])
      : await sql.query<Record<string, unknown>>(`select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id order by o.created_at desc limit 200`);
    return Promise.all(rows.map(hydrate));
  });

export const adminGetOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.number().int().positive() }).parse(input))
  .handler(async ({ context, data }): Promise<Order> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id where o.id = $1 limit 1`,
      [data.id],
    );
    if (!rows[0]) throw new Error("Order not found");
    return hydrate(rows[0]);
  });

export const adminUpdateOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({
      id: z.number().int().positive(),
      status: z.enum(ORDER_STATUSES).optional(),
      preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      timeSlot: z.enum(["morning", "afternoon", "evening"]).optional(),
      assignedAgentId: z.number().int().positive().nullable().optional(),
      note: z.string().trim().max(240).optional(),
    }).parse(input),
  )
  .handler(async ({ context, data }): Promise<Order> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const currentRows = await sql.query<Record<string, unknown>>(`select * from orders where id = $1 limit 1`, [data.id]);
    const current = currentRows[0];
    if (!current) throw new Error("Order not found");
    const prevStatus = String(current.status) as OrderStatus;
    const nextStatus = data.status ?? prevStatus;
    const nextDate = data.preferredDate ?? String(current.preferred_date);
    const nextSlot = data.timeSlot ?? String(current.time_slot);
    const nextAgent = data.assignedAgentId === undefined ? (current.assigned_agent_id as number | null) : data.assignedAgentId;
    await sql.query(
      `update orders set status = $2, preferred_date = $3::date, expected_date = $3::date, time_slot = $4,
         assigned_agent_id = $5,
         delivered_at = case when $2 = 'delivered' then coalesce(delivered_at, now()) else delivered_at end,
         cancelled_at = case when $2 = 'cancelled' then coalesce(cancelled_at, now()) else cancelled_at end,
         updated_at = now() where id = $1`,
      [data.id, nextStatus, nextDate, nextSlot, nextAgent],
    );
    if (nextStatus !== prevStatus) {
      await sql`insert into order_status_history (order_id, status, note, created_by) values (${data.id}, ${nextStatus}, ${data.note ?? ""}, ${context.userId})`;
      await notifyCustomer(String(current.user_id), data.id, String(current.order_number), nextStatus);
    }
    const fresh = await sql.query<Record<string, unknown>>(
      `select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id where o.id = $1`,
      [data.id],
    );
    return hydrate(fresh[0]!);
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Product[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from products order by sort_order, id`;
    return rows.map(mapProduct);
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({
      id: z.number().int().positive().optional(),
      name: z.string().trim().min(2).max(80),
      sizeLabel: z.string().trim().min(1).max(40),
      sizeMl: z.number().int().min(0).max(100000),
      unitPrice: z.number().min(0).max(100000),
      description: z.string().trim().max(240).optional().default(""),
      artKey: z.string().trim().max(20).optional().default("jar20"),
      isActive: z.boolean(),
      sortOrder: z.number().int().min(0).max(999).optional().default(0),
    }).parse(input),
  )
  .handler(async ({ context, data }): Promise<Product[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`update products set name = ${data.name}, size_label = ${data.sizeLabel}, size_ml = ${data.sizeMl},
        unit_price = ${data.unitPrice}, description = ${data.description ?? ""}, art_key = ${data.artKey ?? "jar20"},
        is_active = ${data.isActive}, sort_order = ${data.sortOrder ?? 0} where id = ${data.id}`;
    } else {
      await sql`insert into products (name, size_label, size_ml, unit_price, description, art_key, is_active, sort_order)
        values (${data.name}, ${data.sizeLabel}, ${data.sizeMl}, ${data.unitPrice}, ${data.description ?? ""}, ${data.artKey ?? "jar20"}, ${data.isActive}, ${data.sortOrder ?? 0})`;
    }
    const rows = await sql<Record<string, unknown>>`select * from products order by sort_order, id`;
    return rows.map(mapProduct);
  });

export const adminListCustomers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminCustomer[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select p.user_id, p.full_name, p.mobile, p.alt_mobile, p.role, p.created_at, u.email,
             (select count(*)::int from orders o where o.user_id = p.user_id) as order_count
      from profiles p left join "user" u on u.id = p.user_id order by p.created_at desc
    `;
    const addrRows = await sql<Record<string, unknown>>`
      select distinct on (user_id) * from addresses order by user_id, is_default desc, id
    `;
    const addrByUser = new Map(addrRows.map((r) => [String(r.user_id), mapAddress(r)]));
    return rows.map((r) => ({
      userId: String(r.user_id), fullName: String(r.full_name ?? ""), mobile: String(r.mobile ?? ""),
      altMobile: String(r.alt_mobile ?? ""), email: r.email ? String(r.email) : null,
      role: String(r.role ?? "customer"), createdAt: String(r.created_at ?? ""),
      orderCount: num(r.order_count), address: addrByUser.get(String(r.user_id)) ?? null,
    }));
  });

export const adminListAgents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DeliveryAgent[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from delivery_agents order by id`;
    return rows.map(mapAgent);
  });

export const adminSaveAgent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({
      id: z.number().int().positive().optional(),
      name: z.string().trim().min(2).max(80),
      phone: z.string().trim().refine(indianMobile, "Enter a valid mobile number"),
      isActive: z.boolean(),
    }).parse(input),
  )
  .handler(async ({ context, data }): Promise<DeliveryAgent[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`update delivery_agents set name = ${data.name}, phone = ${data.phone}, is_active = ${data.isActive} where id = ${data.id}`;
    } else {
      await sql`insert into delivery_agents (name, phone, is_active) values (${data.name}, ${data.phone}, ${data.isActive})`;
    }
    const rows = await sql<Record<string, unknown>>`select * from delivery_agents order by id`;
    return rows.map(mapAgent);
  });

export const adminListPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<PaymentMethod[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from payment_methods order by sort_order`;
    return rows.map(mapPayment);
  });

export const adminTogglePayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.string().min(1), enabled: z.boolean() }).parse(input))
  .handler(async ({ context, data }): Promise<PaymentMethod[]> => {
    await requireAdmin(context.userId);
    if (data.id === "cod" && !data.enabled) throw new Error("Cash on Delivery must stay available.");
    const sql = await getSql();
    await sql`update payment_methods set enabled = ${data.enabled} where id = ${data.id}`;
    const rows = await sql<Record<string, unknown>>`select * from payment_methods order by sort_order`;
    return rows.map(mapPayment);
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AgencySettings> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from agency_settings where id = 1`;
    return mapSettings(rows[0]);
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({
      brandName: z.string().trim().min(2).max(40), companyName: z.string().trim().min(2).max(80),
      proprietor: z.string().trim().min(2).max(80), phonePrimary: z.string().trim().min(8).max(15),
      phoneSecondary: z.string().trim().max(15).optional().default(""),
      email: z.string().trim().email(), addressLine: z.string().trim().min(8).max(240),
      fssai: z.string().trim().max(40).optional().default(""),
      upiId: z.string().trim().max(80).optional().default(""),
    }).parse(input),
  )
  .handler(async ({ context, data }): Promise<AgencySettings> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`update agency_settings set brand_name = ${data.brandName}, company_name = ${data.companyName},
      proprietor = ${data.proprietor}, phone_primary = ${data.phonePrimary}, phone_secondary = ${data.phoneSecondary ?? ""},
      email = ${data.email}, address_line = ${data.addressLine}, fssai = ${data.fssai ?? ""}, upi_id = ${data.upiId ?? ""}
      where id = 1`;
    const rows = await sql<Record<string, unknown>>`select * from agency_settings where id = 1`;
    return mapSettings(rows[0]);
  });

export const adminListInbox = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const messages = await sql<Record<string, unknown>>`select * from contact_messages order by created_at desc limit 50`;
    const resets = await sql<Record<string, unknown>>`select * from password_reset_requests order by created_at desc limit 30`;
    return {
      messages: messages.map((m) => ({
        id: num(m.id), name: String(m.name), phone: String(m.phone), email: String(m.email ?? ""),
        message: String(m.message), isRead: m.is_read === true, createdAt: String(m.created_at),
      })),
      resets: resets.map((r) => ({ id: num(r.id), email: String(r.email), handled: r.handled === true, createdAt: String(r.created_at) })),
    };
  });

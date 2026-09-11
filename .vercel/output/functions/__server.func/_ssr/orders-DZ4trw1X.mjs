import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as STATUS_NOTIFY, n as CANCELABLE_STATUSES } from "./agency-dJTRPtCM.mjs";
import { d as mapItem, n as asArr, p as mapOrder, u as mapHistory, v as money } from "./map-CpHYkenY.mjs";
import { r as getSql } from "./db-DCjHyC-w.mjs";
import { t as authMiddleware } from "./middleware-BxvY9SVX.mjs";
import { cn as _enum, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as loadProfile, n as ensureProfile } from "./profile-Qkt-X-zb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DZ4trw1X.js
var placeSchema = object({
	items: array(object({
		productId: number().int().positive(),
		quantity: number().int().min(1).max(50)
	})).min(1),
	preferredDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	timeSlot: _enum([
		"morning",
		"afternoon",
		"evening"
	]),
	note: string().trim().max(400).optional().default(""),
	paymentMethod: string().min(1).max(20)
});
var ORDER_SELECT = `
  o.*, a.name as agent_name, a.phone as agent_phone, a.id as agent_id,
  p.full_name as customer_name, p.mobile as customer_mobile,
  coalesce((select json_agg(i order by i.id) from order_items i where i.order_id = o.id), '[]'::json) as items,
  coalesce((select json_agg(h order by h.created_at, h.id) from order_status_history h where h.order_id = o.id), '[]'::json) as history
`;
async function hydrate(row) {
	return mapOrder(row, {
		items: asArr(row.items).map(mapItem),
		history: asArr(row.history).map(mapHistory)
	});
}
async function getOwnedOrder(userId, orderId) {
	const rows = await (await getSql()).query(`select ${ORDER_SELECT}
     from orders o
     left join delivery_agents a on a.id = o.assigned_agent_id
     left join profiles p on p.user_id = o.user_id
     where o.id = $1 and o.user_id = $2 limit 1`, [orderId, userId]);
	if (!rows[0]) throw new Error("Order not found");
	return hydrate(rows[0]);
}
async function notifyCustomer(userId, orderId, orderNumber, status) {
	const msg = STATUS_NOTIFY[status]?.(orderNumber);
	if (!msg) return;
	await (await getSql())`insert into notifications (user_id, title, body, order_id) values (${userId}, ${msg.title}, ${msg.body}, ${orderId})`;
}
var listMyOrders_createServerFn_handler = createServerRpc({
	id: "d2d387e734d2b9ad38ff263d4ea22b591a11097849ddb7e854b3d1896e2dcb7e",
	name: "listMyOrders",
	filename: "src/lib/server/orders.ts"
}, (opts) => listMyOrders.__executeServer(opts));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyOrders_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	await sql`DELETE FROM orders WHERE created_at < NOW() - INTERVAL '90 days'`;
	const rows = await sql.query(`select ${ORDER_SELECT}
       from orders o
       left join delivery_agents a on a.id = o.assigned_agent_id
       left join profiles p on p.user_id = o.user_id
       where o.user_id = $1 order by o.created_at desc limit 80`, [context.userId]);
	return Promise.all(rows.map(hydrate));
});
var getMyOrder_createServerFn_handler = createServerRpc({
	id: "4096b2026b038348e3866bd521ecc67e4d87fd9fb2bcbcb5a8b133f4d5ff293e",
	name: "getMyOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => getMyOrder.__executeServer(opts));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ id: number().int().positive() }).parse(input)).handler(getMyOrder_createServerFn_handler, async ({ context, data }) => getOwnedOrder(context.userId, data.id));
var getCurrentDelivery_createServerFn_handler = createServerRpc({
	id: "ba32516f755dd325f1963700893b89e65dd1767b32b7efb896e9aebdc1254d9b",
	name: "getCurrentDelivery",
	filename: "src/lib/server/orders.ts"
}, (opts) => getCurrentDelivery.__executeServer(opts));
var getCurrentDelivery = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getCurrentDelivery_createServerFn_handler, async ({ context }) => {
	const rows = await (await getSql()).query(`select ${ORDER_SELECT}
       from orders o
       left join delivery_agents a on a.id = o.assigned_agent_id
       left join profiles p on p.user_id = o.user_id
       where o.user_id = $1 and o.status in ('placed','confirmed','preparing','out_for_delivery')
       order by o.created_at desc limit 1`, [context.userId]);
	return rows[0] ? hydrate(rows[0]) : null;
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "eff383686543aaf1d3781cf0aaa6a0b80974ddd9537d83f9cfc933b88b01f00f",
	name: "placeOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => placeSchema.parse(input)).handler(placeOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const profile = await loadProfile(context.userId);
	if (!profile.fullName || !profile.mobile) throw new Error("Please complete your name and mobile number before ordering.");
	if (!profile.address) throw new Error("Please save a delivery address before ordering.");
	const methods = await sql`select id from payment_methods where enabled = true`;
	if (!new Set(methods.map((m) => m.id)).has(data.paymentMethod)) throw new Error("That payment method is not available.");
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const preferred = /* @__PURE__ */ new Date(`${data.preferredDate}T00:00:00`);
	if (Number.isNaN(preferred.getTime()) || preferred < today) throw new Error("Choose a delivery date of today or later.");
	const productIds = data.items.map((i) => i.productId);
	const products = (await sql`select * from products where is_active = true`).filter((p) => productIds.includes(Number(p.id)));
	if (products.length !== productIds.length) throw new Error("One or more products are no longer available.");
	const byId = new Map(products.map((p) => [Number(p.id), p]));
	const lines = data.items.map((item) => {
		const p = byId.get(item.productId);
		if (!p) throw new Error("Product missing.");
		const unit = money(p.unit_price);
		return {
			productId: item.productId,
			name: String(p.name),
			sizeLabel: String(p.size_label),
			unitPrice: unit,
			quantity: item.quantity,
			lineTotal: Math.round(unit * item.quantity * 100) / 100
		};
	});
	const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
	const addr = profile.address;
	const snapshot = JSON.stringify({
		label: addr.label,
		line1: addr.line1,
		line2: addr.line2,
		city: addr.city,
		state: addr.state,
		pincode: addr.pincode,
		landmark: addr.landmark
	});
	const orderNumber = `SUP-${(await sql`select nextval('order_number_seq')::text as n`)[0]?.n ?? "1025"}`;
	const inserted = await sql.query(`insert into orders (
        order_number, user_id, status, address_snapshot, preferred_date, time_slot,
        note, payment_method, payment_status, subtotal, total, expected_date
      ) values ($1,$2,'placed',$3::jsonb,$4::date,$5,$6,$7,'pending',$8,$9,$4::date) returning id`, [
		orderNumber,
		context.userId,
		snapshot,
		data.preferredDate,
		data.timeSlot,
		data.note ?? "",
		data.paymentMethod,
		subtotal,
		subtotal
	]);
	const orderId = Number(inserted[0]?.id);
	if (!orderId) throw new Error("Could not create the order.");
	for (const line of lines) await sql`
        insert into order_items (order_id, product_id, product_name, size_label, unit_price, quantity, line_total)
        values (${orderId}, ${line.productId}, ${line.name}, ${line.sizeLabel}, ${line.unitPrice}, ${line.quantity}, ${line.lineTotal})
      `;
	await sql`insert into order_status_history (order_id, status, note, created_by) values (${orderId}, 'placed', 'Order placed by customer', ${context.userId})`;
	await sql`insert into payments (order_id, method, amount, status) values (${orderId}, ${data.paymentMethod}, ${subtotal}, 'pending')`;
	await sql`
      insert into notifications (user_id, title, body, order_id)
      values (${context.userId}, ${`Order ${orderNumber} placed`}, ${`Your order ${orderNumber} has been placed. We will confirm it shortly.`}, ${orderId})
    `;
	return getOwnedOrder(context.userId, orderId);
});
var cancelMyOrder_createServerFn_handler = createServerRpc({
	id: "ce04adca7d8cf2e5655362378bfcda50dea2e05cc45f2f7d630ee90c323d90db",
	name: "cancelMyOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => cancelMyOrder.__executeServer(opts));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive(),
	reason: string().trim().max(200).optional()
}).parse(input)).handler(cancelMyOrder_createServerFn_handler, async ({ context, data }) => {
	const existing = await getOwnedOrder(context.userId, data.id);
	if (!CANCELABLE_STATUSES.includes(existing.status)) throw new Error("This order can no longer be cancelled. Please call the agency.");
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
//#endregion
export { cancelMyOrder_createServerFn_handler, getCurrentDelivery_createServerFn_handler, getMyOrder_createServerFn_handler, listMyOrders_createServerFn_handler, placeOrder_createServerFn_handler };

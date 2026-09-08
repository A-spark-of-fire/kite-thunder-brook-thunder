import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as ORDER_STATUSES } from "./agency-dJTRPtCM.mjs";
import { a as indianMobile } from "./utils-sqhcPpa2.mjs";
import { r as getSql } from "./db-B45d6uD3.mjs";
import { t as authMiddleware } from "./middleware--6meZ4AD.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as notifyCustomer } from "./orders-BTden6zy.mjs";
import { a as mapItem, c as mapPayment, d as mapSettings, f as num, i as mapHistory, l as mapProduct, n as mapAddress, r as mapAgent, s as mapOrder, t as asArr } from "./map-NoYL9Vl0.mjs";
import { c as requireAdmin } from "./profile-BI9MlK96.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CHP6LS_3.js
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
var getAdminStats_createServerFn_handler = createServerRpc({
	id: "6406231809d31ba8950a82a40792322c0625536ab6f17170901260c406565838",
	name: "getAdminStats",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminStats.__executeServer(opts));
var getAdminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminStats_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const incoming = await sql`select count(*)::int as n from orders where status in ('placed','confirmed','preparing')`;
	const out = await sql`select count(*)::int as n from orders where status = 'out_for_delivery'`;
	const delivered = await sql`select count(*)::int as n from orders where status = 'delivered' and delivered_at::date = current_date`;
	const customers = await sql`select count(*)::int as n from profiles where role = 'customer'`;
	return {
		incoming: num(incoming[0]?.n),
		outForDelivery: num(out[0]?.n),
		deliveredToday: num(delivered[0]?.n),
		customers: num(customers[0]?.n)
	};
});
var adminListOrders_createServerFn_handler = createServerRpc({
	id: "588d427c5c6a9bd05e1014cec0ec3321b2ef1da275509094279b6af46ea31f4e",
	name: "adminListOrders",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListOrders.__executeServer(opts));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ status: string().optional() }).optional().parse(input ?? {})).handler(adminListOrders_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const status = data?.status && data.status !== "all" ? data.status : null;
	const rows = status ? await sql.query(`select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id where o.status = $1 order by o.created_at desc limit 200`, [status]) : await sql.query(`select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id order by o.created_at desc limit 200`);
	return Promise.all(rows.map(hydrate));
});
var adminGetOrder_createServerFn_handler = createServerRpc({
	id: "0623f380e2e38cdfa24239b07087a46e8a338e90f061f9eb41c74a4a70e8eff9",
	name: "adminGetOrder",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminGetOrder.__executeServer(opts));
var adminGetOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ id: number().int().positive() }).parse(input)).handler(adminGetOrder_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const rows = await (await getSql()).query(`select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id where o.id = $1 limit 1`, [data.id]);
	if (!rows[0]) throw new Error("Order not found");
	return hydrate(rows[0]);
});
var adminUpdateOrder_createServerFn_handler = createServerRpc({
	id: "1adf2a1e37f75fbf14db6c1c320664b023c54d351730c8615d2801c49c5eee75",
	name: "adminUpdateOrder",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminUpdateOrder.__executeServer(opts));
var adminUpdateOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive(),
	status: _enum(ORDER_STATUSES).optional(),
	preferredDate: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	timeSlot: _enum([
		"morning",
		"afternoon",
		"evening"
	]).optional(),
	assignedAgentId: number().int().positive().nullable().optional(),
	note: string().trim().max(240).optional()
}).parse(input)).handler(adminUpdateOrder_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const current = (await sql.query(`select * from orders where id = $1 limit 1`, [data.id]))[0];
	if (!current) throw new Error("Order not found");
	const prevStatus = String(current.status);
	const nextStatus = data.status ?? prevStatus;
	const nextDate = data.preferredDate ?? String(current.preferred_date);
	const nextSlot = data.timeSlot ?? String(current.time_slot);
	const nextAgent = data.assignedAgentId === void 0 ? current.assigned_agent_id : data.assignedAgentId;
	await sql.query(`update orders set status = $2, preferred_date = $3::date, expected_date = $3::date, time_slot = $4,
         assigned_agent_id = $5,
         delivered_at = case when $2 = 'delivered' then coalesce(delivered_at, now()) else delivered_at end,
         cancelled_at = case when $2 = 'cancelled' then coalesce(cancelled_at, now()) else cancelled_at end,
         updated_at = now() where id = $1`, [
		data.id,
		nextStatus,
		nextDate,
		nextSlot,
		nextAgent
	]);
	if (nextStatus !== prevStatus) {
		await sql`insert into order_status_history (order_id, status, note, created_by) values (${data.id}, ${nextStatus}, ${data.note ?? ""}, ${context.userId})`;
		await notifyCustomer(String(current.user_id), data.id, String(current.order_number), nextStatus);
	}
	return hydrate((await sql.query(`select ${ORDER_SELECT} from orders o left join delivery_agents a on a.id = o.assigned_agent_id left join profiles p on p.user_id = o.user_id where o.id = $1`, [data.id]))[0]);
});
var adminListProducts_createServerFn_handler = createServerRpc({
	id: "e44d25be80bce2b94deb72faf36c4882bfe3911806ab70b7b500f221420cd68e",
	name: "adminListProducts",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListProducts.__executeServer(opts));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListProducts_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`select * from products order by sort_order, id`).map(mapProduct);
});
var adminSaveProduct_createServerFn_handler = createServerRpc({
	id: "d1945e7f257482ecf2137acde558fe8edd242c8fb898534842dc62c930a26d2d",
	name: "adminSaveProduct",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveProduct.__executeServer(opts));
var adminSaveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive().optional(),
	name: string().trim().min(2).max(80),
	sizeLabel: string().trim().min(1).max(40),
	sizeMl: number().int().min(0).max(1e5),
	unitPrice: number().min(0).max(1e5),
	description: string().trim().max(240).optional().default(""),
	artKey: string().trim().max(20).optional().default("jar20"),
	isActive: boolean(),
	sortOrder: number().int().min(0).max(999).optional().default(0)
}).parse(input)).handler(adminSaveProduct_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	if (data.id) await sql`update products set name = ${data.name}, size_label = ${data.sizeLabel}, size_ml = ${data.sizeMl},
        unit_price = ${data.unitPrice}, description = ${data.description ?? ""}, art_key = ${data.artKey ?? "jar20"},
        is_active = ${data.isActive}, sort_order = ${data.sortOrder ?? 0} where id = ${data.id}`;
	else await sql`insert into products (name, size_label, size_ml, unit_price, description, art_key, is_active, sort_order)
        values (${data.name}, ${data.sizeLabel}, ${data.sizeMl}, ${data.unitPrice}, ${data.description ?? ""}, ${data.artKey ?? "jar20"}, ${data.isActive}, ${data.sortOrder ?? 0})`;
	return (await sql`select * from products order by sort_order, id`).map(mapProduct);
});
var adminListCustomers_createServerFn_handler = createServerRpc({
	id: "96c3c90be288da29c9bf1bf1ed992ffb93d3fc3eb0f0cb071e84d713b896418f",
	name: "adminListCustomers",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListCustomers.__executeServer(opts));
var adminListCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListCustomers_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const rows = await sql`
      select p.user_id, p.full_name, p.mobile, p.alt_mobile, p.role, p.created_at, u.email,
             (select count(*)::int from orders o where o.user_id = p.user_id) as order_count
      from profiles p left join "user" u on u.id = p.user_id order by p.created_at desc
    `;
	const addrRows = await sql`
      select distinct on (user_id) * from addresses order by user_id, is_default desc, id
    `;
	const addrByUser = new Map(addrRows.map((r) => [String(r.user_id), mapAddress(r)]));
	return rows.map((r) => ({
		userId: String(r.user_id),
		fullName: String(r.full_name ?? ""),
		mobile: String(r.mobile ?? ""),
		altMobile: String(r.alt_mobile ?? ""),
		email: r.email ? String(r.email) : null,
		role: String(r.role ?? "customer"),
		createdAt: String(r.created_at ?? ""),
		orderCount: num(r.order_count),
		address: addrByUser.get(String(r.user_id)) ?? null
	}));
});
var adminListAgents_createServerFn_handler = createServerRpc({
	id: "baa3978ec8f136fead3ca9c175d46f72554d51657981651e8ad14ce9b2c08598",
	name: "adminListAgents",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListAgents.__executeServer(opts));
var adminListAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListAgents_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`select * from delivery_agents order by id`).map(mapAgent);
});
var adminSaveAgent_createServerFn_handler = createServerRpc({
	id: "97c976fe3449882df65ec2917d62762b8ce923ecd6009cbcb59be4b6aebcd1b0",
	name: "adminSaveAgent",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveAgent.__executeServer(opts));
var adminSaveAgent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive().optional(),
	name: string().trim().min(2).max(80),
	phone: string().trim().refine(indianMobile, "Enter a valid mobile number"),
	isActive: boolean()
}).parse(input)).handler(adminSaveAgent_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	if (data.id) await sql`update delivery_agents set name = ${data.name}, phone = ${data.phone}, is_active = ${data.isActive} where id = ${data.id}`;
	else await sql`insert into delivery_agents (name, phone, is_active) values (${data.name}, ${data.phone}, ${data.isActive})`;
	return (await sql`select * from delivery_agents order by id`).map(mapAgent);
});
var adminListPayments_createServerFn_handler = createServerRpc({
	id: "da559204811580d85f5d2d3a84fe0377e4f596fe27a42bb22c5c70d8ad73226b",
	name: "adminListPayments",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListPayments.__executeServer(opts));
var adminListPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListPayments_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`select * from payment_methods order by sort_order`).map(mapPayment);
});
var adminTogglePayment_createServerFn_handler = createServerRpc({
	id: "422b2e31d50b0e09bf8c7a44776c9efec144c72b1287bfdea87be67de3290400",
	name: "adminTogglePayment",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminTogglePayment.__executeServer(opts));
var adminTogglePayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: string().min(1),
	enabled: boolean()
}).parse(input)).handler(adminTogglePayment_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (data.id === "cod" && !data.enabled) throw new Error("Cash on Delivery must stay available.");
	const sql = await getSql();
	await sql`update payment_methods set enabled = ${data.enabled} where id = ${data.id}`;
	return (await sql`select * from payment_methods order by sort_order`).map(mapPayment);
});
var adminGetSettings_createServerFn_handler = createServerRpc({
	id: "7c6b82e0ce0bba37c904ef67f1d4882c6dde8ee39f59dcea6d97c8935c479940",
	name: "adminGetSettings",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminGetSettings.__executeServer(opts));
var adminGetSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminGetSettings_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const rows = await (await getSql())`select * from agency_settings where id = 1`;
	return mapSettings(rows[0]);
});
var adminSaveSettings_createServerFn_handler = createServerRpc({
	id: "4559ed6bf9a7b05c02163e5741d4be1b6008bb0bb52c25c4782cb2fe0f4383ca",
	name: "adminSaveSettings",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveSettings.__executeServer(opts));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	brandName: string().trim().min(2).max(40),
	companyName: string().trim().min(2).max(80),
	proprietor: string().trim().min(2).max(80),
	phonePrimary: string().trim().min(8).max(15),
	phoneSecondary: string().trim().max(15).optional().default(""),
	email: string().trim().email(),
	addressLine: string().trim().min(8).max(240),
	fssai: string().trim().max(40).optional().default(""),
	upiId: string().trim().max(80).optional().default("")
}).parse(input)).handler(adminSaveSettings_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	await sql`update agency_settings set brand_name = ${data.brandName}, company_name = ${data.companyName},
      proprietor = ${data.proprietor}, phone_primary = ${data.phonePrimary}, phone_secondary = ${data.phoneSecondary ?? ""},
      email = ${data.email}, address_line = ${data.addressLine}, fssai = ${data.fssai ?? ""}, upi_id = ${data.upiId ?? ""}
      where id = 1`;
	const rows = await sql`select * from agency_settings where id = 1`;
	return mapSettings(rows[0]);
});
var adminListInbox_createServerFn_handler = createServerRpc({
	id: "9eb5cf55c176a07ab91c61ccd909b5ee4ed2f3c8b3207e785de245a6114e8a28",
	name: "adminListInbox",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListInbox.__executeServer(opts));
var adminListInbox = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListInbox_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const messages = await sql`select * from contact_messages order by created_at desc limit 50`;
	const resets = await sql`select * from password_reset_requests order by created_at desc limit 30`;
	return {
		messages: messages.map((m) => ({
			id: num(m.id),
			name: String(m.name),
			phone: String(m.phone),
			email: String(m.email ?? ""),
			message: String(m.message),
			isRead: m.is_read === true,
			createdAt: String(m.created_at)
		})),
		resets: resets.map((r) => ({
			id: num(r.id),
			email: String(r.email),
			handled: r.handled === true,
			createdAt: String(r.created_at)
		}))
	};
});
//#endregion
export { adminGetOrder_createServerFn_handler, adminGetSettings_createServerFn_handler, adminListAgents_createServerFn_handler, adminListCustomers_createServerFn_handler, adminListInbox_createServerFn_handler, adminListOrders_createServerFn_handler, adminListPayments_createServerFn_handler, adminListProducts_createServerFn_handler, adminSaveAgent_createServerFn_handler, adminSaveProduct_createServerFn_handler, adminSaveSettings_createServerFn_handler, adminTogglePayment_createServerFn_handler, adminUpdateOrder_createServerFn_handler, getAdminStats_createServerFn_handler };

import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { _ as mapSettings, c as mapAddress, f as mapNotification, g as mapProfile, o as indianMobile, y as num } from "./map-CpHYkenY.mjs";
import { F as object, M as literal, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-DCjHyC-w.mjs";
import { t as authMiddleware } from "./middleware-BxvY9SVX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-klaadS26.js
var addressSchema = object({
	label: string().trim().min(1).max(40).default("Home"),
	line1: string().trim().min(3).max(160),
	line2: string().trim().max(160).optional().default(""),
	city: string().trim().min(2).max(80),
	state: string().trim().min(2).max(80).default("West Bengal"),
	pincode: string().trim().regex(/^\d{6}$/, "PIN code must be 6 digits"),
	landmark: string().trim().max(120).optional().default("")
});
async function ensureProfile(userId, hint) {
	const sql = await getSql();
	await sql`
    insert into profiles (user_id, full_name)
    values (${userId}, ${hint?.name ?? ""})
    on conflict (user_id) do nothing
  `;
	if (hint?.name) await sql`
      update profiles
      set full_name = case when full_name = '' then ${hint.name} else full_name end, updated_at = now()
      where user_id = ${userId}
    `;
}
async function adminCount() {
	const rows = await (await getSql())`select count(*)::int as n from profiles where role in ('admin', 'staff')`;
	return num(rows[0]?.n);
}
async function loadProfile(userId) {
	const sql = await getSql();
	await ensureProfile(userId);
	const rows = await sql`
    select p.user_id, p.role, p.full_name, p.mobile, p.alt_mobile, u.email, u.image
    from profiles p
    left join "user" u on u.id = p.user_id
    where p.user_id = ${userId}
    limit 1
  `;
	const addrRows = await sql`
    select * from addresses where user_id = ${userId} order by is_default desc, id asc limit 1
  `;
	const address = addrRows[0] ? mapAddress(addrRows[0]) : null;
	const admins = await adminCount();
	const role = String(rows[0]?.role ?? "customer");
	return mapProfile(rows[0] ?? { user_id: userId }, {
		canAccessAdmin: role === "admin" || role === "staff" || admins === 0,
		adminExists: admins > 0,
		address
	});
}
var ensureAgencyDesk_createServerFn_handler = createServerRpc({
	id: "40e23c73668f4ab762222509fe7b3eb24ef7704e5e9c43603c5ca108634916f1",
	name: "ensureAgencyDesk",
	filename: "src/lib/server/profile.ts"
}, (opts) => ensureAgencyDesk.__executeServer(opts));
var ensureAgencyDesk = createServerFn({ method: "POST" }).handler(ensureAgencyDesk_createServerFn_handler, async () => {
	const { seedAgencyAccounts } = await import("./seed-agency-DNp2P8JK.mjs").then((n) => n.r);
	await seedAgencyAccounts();
	return { ok: true };
});
var getMe_createServerFn_handler = createServerRpc({
	id: "e2e2d55e5983cb90d0b95e02e1fd542d12faaf829584a92949606f2e8de3ef3f",
	name: "getMe",
	filename: "src/lib/server/profile.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	const { seedAgencyAccounts } = await import("./seed-agency-DNp2P8JK.mjs").then((n) => n.r);
	await seedAgencyAccounts();
	const sql = await getSql();
	const profile = await loadProfile(context.userId);
	const settingsRows = await sql`select * from agency_settings where id = 1`;
	const unread = await sql`
      select count(*)::int as n from notifications where user_id = ${context.userId} and is_read = false
    `;
	return {
		profile,
		settings: mapSettings(settingsRows[0]),
		unreadCount: num(unread[0]?.n)
	};
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "2516a54386004386c896f1a0ac5bdf163cb6fe80f8ce05136f7c7b30edbcc98d",
	name: "updateMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	fullName: string().trim().min(2).max(80),
	mobile: string().trim().refine(indianMobile, "Enter a valid 10-digit mobile number"),
	altMobile: string().trim().optional().default("").refine((v) => !v || indianMobile(v), "Enter a valid alternate number")
}).parse(input)).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	await sql`
      update profiles set full_name = ${data.fullName}, mobile = ${data.mobile},
        alt_mobile = ${data.altMobile ?? ""}, updated_at = now()
      where user_id = ${context.userId}
    `;
	await sql`update "user" set name = ${data.fullName}, "updatedAt" = now() where id = ${context.userId}`;
	return loadProfile(context.userId);
});
var saveMyAddress_createServerFn_handler = createServerRpc({
	id: "49c6e9aaf5bd863cb68dfd299c8250e41816be5dd4488ff5cc178acd04745bb4",
	name: "saveMyAddress",
	filename: "src/lib/server/profile.ts"
}, (opts) => saveMyAddress.__executeServer(opts));
var saveMyAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => addressSchema.parse(input)).handler(saveMyAddress_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	const existing = await sql`
      select id from addresses where user_id = ${context.userId} order by is_default desc, id asc limit 1
    `;
	if (existing[0]) await sql`
        update addresses set label = ${data.label}, line1 = ${data.line1}, line2 = ${data.line2 ?? ""},
          city = ${data.city}, state = ${data.state}, pincode = ${data.pincode},
          landmark = ${data.landmark ?? ""}, is_default = true
        where id = ${existing[0].id} and user_id = ${context.userId}
      `;
	else await sql`
        insert into addresses (user_id, label, line1, line2, city, state, pincode, landmark, is_default)
        values (${context.userId}, ${data.label}, ${data.line1}, ${data.line2 ?? ""},
          ${data.city}, ${data.state}, ${data.pincode}, ${data.landmark ?? ""}, true)
      `;
	return loadProfile(context.userId);
});
var listMyNotifications_createServerFn_handler = createServerRpc({
	id: "3da46047aaa385fcc42b29b24e1cfc9e88c77d927115ea8a642249abb0fd8257",
	name: "listMyNotifications",
	filename: "src/lib/server/profile.ts"
}, (opts) => listMyNotifications.__executeServer(opts));
var listMyNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyNotifications_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select * from notifications where user_id = ${context.userId} order by created_at desc limit 40
    `).map(mapNotification);
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "47b55f282af337a8053ad8b7a9a7c43a5a576fb942380dd3ccdfacb45eb3bbc5",
	name: "markNotificationsRead",
	filename: "src/lib/server/profile.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update notifications set is_read = true where user_id = ${context.userId} and is_read = false`;
	return { ok: true };
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "4ef68c6b9033e9aeec7c04188193b0e60fed577e659692f61a57f0f6b6babe66",
	name: "submitContact",
	filename: "src/lib/server/profile.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	name: string().trim().min(2).max(80),
	phone: string().trim().refine(indianMobile, "Enter a valid mobile number"),
	email: string().trim().email().optional().or(literal("")),
	message: string().trim().min(8).max(1e3)
}).parse(input)).handler(submitContact_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into contact_messages (user_id, name, phone, email, message)
      values (${context.userId}, ${data.name}, ${data.phone}, ${data.email ?? ""}, ${data.message})
    `;
	return { ok: true };
});
var requestPasswordReset_createServerFn_handler = createServerRpc({
	id: "592e1d67071857e568161a728d09e6d13c5bb09ccb4ba1a1a012b4d76c4f1fda",
	name: "requestPasswordReset",
	filename: "src/lib/server/profile.ts"
}, (opts) => requestPasswordReset.__executeServer(opts));
var requestPasswordReset = createServerFn({ method: "POST" }).validator((input) => object({ email: string().trim().email() }).parse(input)).handler(requestPasswordReset_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into password_reset_requests (email) values (${data.email.toLowerCase()})`;
	return { ok: true };
});
var claimAdminDesk_createServerFn_handler = createServerRpc({
	id: "1bac7929a31e21951e9922798ee5d2877d4b1ad22ece611264aa1a03ae6b10a1",
	name: "claimAdminDesk",
	filename: "src/lib/server/profile.ts"
}, (opts) => claimAdminDesk.__executeServer(opts));
var claimAdminDesk = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimAdminDesk_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	if (await adminCount() > 0) throw new Error("An agency administrator already exists.");
	await sql`update profiles set role = 'admin', updated_at = now() where user_id = ${context.userId}`;
	return loadProfile(context.userId);
});
//#endregion
export { claimAdminDesk_createServerFn_handler, ensureAgencyDesk_createServerFn_handler, getMe_createServerFn_handler, listMyNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler, requestPasswordReset_createServerFn_handler, saveMyAddress_createServerFn_handler, submitContact_createServerFn_handler, updateMyProfile_createServerFn_handler };

import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { c as mapAddress, g as mapProfile, o as indianMobile, y as num } from "./map-CpHYkenY.mjs";
import { r as getSql } from "./db-DCjHyC-w.mjs";
import { t as authMiddleware } from "./middleware-BxvY9SVX.mjs";
import { gn as object, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Qkt-X-zb.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
async function requireAdmin(userId) {
	const profile = await loadProfile(userId);
	if (profile.role !== "admin" && profile.role !== "staff") throw new Error("Forbidden");
	return profile;
}
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e2e2d55e5983cb90d0b95e02e1fd542d12faaf829584a92949606f2e8de3ef3f"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	fullName: string().trim().min(2).max(80),
	mobile: string().trim().refine(indianMobile, "Enter a valid 10-digit mobile number"),
	altMobile: string().trim().optional().default("").refine((v) => !v || indianMobile(v), "Enter a valid alternate number")
}).parse(input)).handler(createSsrRpc("2516a54386004386c896f1a0ac5bdf163cb6fe80f8ce05136f7c7b30edbcc98d"));
var saveMyAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => addressSchema.parse(input)).handler(createSsrRpc("49c6e9aaf5bd863cb68dfd299c8250e41816be5dd4488ff5cc178acd04745bb4"));
var listMyNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3da46047aaa385fcc42b29b24e1cfc9e88c77d927115ea8a642249abb0fd8257"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("47b55f282af337a8053ad8b7a9a7c43a5a576fb942380dd3ccdfacb45eb3bbc5"));
var submitContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	name: string().trim().min(2).max(80),
	phone: string().trim().refine(indianMobile, "Enter a valid mobile number"),
	email: string().trim().email().optional().or(literal("")),
	message: string().trim().min(8).max(1e3)
}).parse(input)).handler(createSsrRpc("4ef68c6b9033e9aeec7c04188193b0e60fed577e659692f61a57f0f6b6babe66"));
var requestPasswordReset = createServerFn({ method: "POST" }).validator((input) => object({ email: string().trim().email() }).parse(input)).handler(createSsrRpc("592e1d67071857e568161a728d09e6d13c5bb09ccb4ba1a1a012b4d76c4f1fda"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1bac7929a31e21951e9922798ee5d2877d4b1ad22ece611264aa1a03ae6b10a1"));
//#endregion
export { loadProfile as a, requireAdmin as c, updateMyProfile as d, listMyNotifications as i, saveMyAddress as l, ensureProfile as n, markNotificationsRead as o, getMe as r, requestPasswordReset as s, createSsrRpc as t, submitContact as u };

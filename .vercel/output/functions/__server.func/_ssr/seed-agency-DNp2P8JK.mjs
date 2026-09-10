import { s as __exportAll } from "./ssr.mjs";
import { r as getSql } from "./db-DCjHyC-w.mjs";
import { i as verifyPassword, r as hashPassword } from "../_libs/better-auth__utils.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seed-agency-DNp2P8JK.js
/**
* `@better-auth/utils/password` uses the "node" export condition in package.json
* to automatically pick the right implementation:
*   - Node.js / Bun / Deno → `node:crypto scrypt` (libuv thread pool, non-blocking)
*   - Unsupported runtimes → `@noble/hashes scrypt` (pure JS fallback)
*/
var hashPassword$1 = hashPassword;
var verifyPassword$1 = async ({ hash, password }) => {
	return verifyPassword(hash, password);
};
var seed_agency_exports = /* @__PURE__ */ __exportAll({
	AGENCY_STAFF: () => AGENCY_STAFF,
	isAgencyStaffEmail: () => isAgencyStaffEmail,
	seedAgencyAccounts: () => seedAgencyAccounts
});
/**
* Server-only agency desk accounts. Do not import this module from client code.
* Passwords are hashed into Better Auth's `account` table on first use.
*/
var AGENCY_STAFF = [{
	email: "ananda.hazra@supeyo.in",
	password: "KsE-Hazra#9n4Qx7Wm",
	name: "Ananda Hazra",
	role: "admin",
	mobile: "8617297495"
}, {
	email: "kalpataru.desk@supeyo.in",
	password: "Nadia-Desk$4vR8kLp2",
	name: "Kalpataru Desk",
	role: "staff",
	mobile: "8967648044"
}];
function isAgencyStaffEmail(email) {
	const normalized = email.trim().toLowerCase();
	return AGENCY_STAFF.some((account) => account.email === normalized);
}
var globalRef = globalThis;
function seedAgencyAccounts() {
	globalRef.__supeyoAgencySeed__ ??= seedOnce().catch((err) => {
		globalRef.__supeyoAgencySeed__ = void 0;
		throw err;
	});
	return globalRef.__supeyoAgencySeed__;
}
async function seedOnce() {
	const sql = await getSql();
	for (const account of AGENCY_STAFF) {
		const email = account.email.toLowerCase();
		const existingUser = await sql`
      select id from "user" where email = ${email} limit 1
    `;
		let userId;
		if (existingUser[0]) {
			userId = existingUser[0].id;
			await sql`
        update "user"
        set name = ${account.name}, "emailVerified" = true, "updatedAt" = now()
        where id = ${userId}
      `;
		} else {
			userId = `agency-${crypto.randomUUID()}`;
			await sql`
        insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
        values (${userId}, ${account.name}, ${email}, true, now(), now())
      `;
		}
		const credential = await sql`
      select id, password from "account"
      where "userId" = ${userId} and "providerId" = 'credential'
      limit 1
    `;
		const currentHash = credential[0]?.password ?? "";
		if (!(currentHash ? await verifyPassword$1({
			hash: currentHash,
			password: account.password
		}) : false)) {
			const passwordHash = await hashPassword$1(account.password);
			if (credential[0]) await sql`
          update "account"
          set password = ${passwordHash}, "updatedAt" = now()
          where id = ${credential[0].id}
        `;
			else await sql`
          insert into "account" (
            id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt"
          ) values (
            ${`credential-${crypto.randomUUID()}`},
            ${userId},
            'credential',
            ${userId},
            ${passwordHash},
            now(),
            now()
          )
        `;
		}
		await sql`
      insert into profiles (user_id, role, full_name, mobile, alt_mobile, created_at, updated_at)
      values (${userId}, ${account.role}, ${account.name}, ${account.mobile}, '', now(), now())
      on conflict (user_id) do update set
        role = excluded.role,
        full_name = excluded.full_name,
        mobile = excluded.mobile,
        updated_at = now()
    `;
	}
}
//#endregion
export { verifyPassword$1 as a, hashPassword$1 as i, seedAgencyAccounts as n, seed_agency_exports as r, isAgencyStaffEmail as t };

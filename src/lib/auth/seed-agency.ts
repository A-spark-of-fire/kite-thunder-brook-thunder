import { hashPassword, verifyPassword } from "better-auth/crypto";
import { getSql } from "../db";

/**
 * Server-only agency desk accounts. Do not import this module from client code.
 * Passwords are hashed into Better Auth's `account` table on first use.
 */
export const AGENCY_STAFF = [
  {
    email: "ananda.hazra@supeyo.in",
    password: "KsE-Hazra#9n4Qx7Wm",
    name: "Ananda Hazra",
    role: "admin",
    mobile: "8617297495",
  },
  {
    email: "kalpataru.desk@supeyo.in",
    password: "Nadia-Desk$4vR8kLp2",
    name: "Kalpataru Desk",
    role: "staff",
    mobile: "8967648044",
  },
] as const;

export type AgencyStaffEmail = (typeof AGENCY_STAFF)[number]["email"];

export function isAgencyStaffEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return AGENCY_STAFF.some((account) => account.email === normalized);
}

const globalRef = globalThis as typeof globalThis & {
  __supeyoAgencySeed__?: Promise<void>;
};

export function seedAgencyAccounts(): Promise<void> {
  globalRef.__supeyoAgencySeed__ ??= seedOnce().catch((err) => {
    globalRef.__supeyoAgencySeed__ = undefined;
    throw err;
  });
  return globalRef.__supeyoAgencySeed__;
}

async function seedOnce(): Promise<void> {
  const sql = await getSql();

  for (const account of AGENCY_STAFF) {
    const email = account.email.toLowerCase();
    const existingUser = await sql<{ id: string }>`
      select id from "user" where email = ${email} limit 1
    `;

    let userId: string;
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

    const credential = await sql<{ id: string; password: string | null }>`
      select id, password from "account"
      where "userId" = ${userId} and "providerId" = 'credential'
      limit 1
    `;

    const currentHash = credential[0]?.password ?? "";
    const alreadyMatches = currentHash
      ? await verifyPassword({ hash: currentHash, password: account.password })
      : false;

    if (!alreadyMatches) {
      const passwordHash = await hashPassword(account.password);
      if (credential[0]) {
        await sql`
          update "account"
          set password = ${passwordHash}, "updatedAt" = now()
          where id = ${credential[0].id}
        `;
      } else {
        await sql`
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

import { hashPassword } from "better-auth/crypto";
import { getSql } from "../db";

const AGENCY_ACCOUNTS = [
  {
    email: "agency.admin@supeyo.in",
    password: "AgencyDesk!2026",
    name: "Agency Admin",
    role: "admin",
  },
  {
    email: "agency.staff@supeyo.in",
    password: "DeskStaff!2026",
    name: "Agency Staff",
    role: "staff",
  },
] as const;

export async function seedAgencyAccounts() {
  const sql = await getSql();

  for (const account of AGENCY_ACCOUNTS) {
    const email = account.email.toLowerCase();
    const existingUser = await sql<{ id: string }>`
      select id from "user" where email = ${email} limit 1
    `;

    let userId: string;
    if (existingUser[0]) {
      userId = existingUser[0].id;
      await sql`
        update "user"
        set name = ${account.name}, "updatedAt" = now()
        where id = ${userId}
      `;
    } else {
      userId = `agency-${crypto.randomUUID()}`;
      await sql`
        insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
        values (${userId}, ${account.name}, ${email}, true, now(), now())
      `;
    }

    const credential = await sql<{ id: string }>`
      select id from "account"
      where "userId" = ${userId} and "providerId" = 'credential'
      limit 1
    `;

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
          id,
          "accountId",
          "providerId",
          "userId",
          password,
          "createdAt",
          "updatedAt"
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
      values (${userId}, ${account.role}, ${account.name}, '0000000000', '', now(), now())
      on conflict (user_id) do update set
        role = excluded.role,
        full_name = excluded.full_name,
        updated_at = now()
    `;
  }
}

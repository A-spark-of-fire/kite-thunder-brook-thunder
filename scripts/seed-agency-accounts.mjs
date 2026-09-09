import { randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { getSql } from "../src/lib/db.ts";

const accounts = [
  {
    email: "agency.admin@supeyo.in",
    password: "AgencyDesk@2026",
    name: "Agency Admin",
    role: "admin",
  },
  {
    email: "agency.staff@supeyo.in",
    password: "DeskStaff@2026",
    name: "Agency Staff",
    role: "staff",
  },
];

async function ensureAgencyAccount(account) {
  const sql = await getSql();
  const email = account.email.toLowerCase();

  const existingUser = await sql`select id from "user" where email = ${email} limit 1`;
  let userId;

  if (existingUser[0]) {
    userId = existingUser[0].id;
    await sql`
      update "user"
      set name = ${account.name}, "updatedAt" = now()
      where id = ${userId}
    `;
  } else {
    userId = `agency-${randomBytes(8).toString("hex")}`;
    await sql`
      insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
      values (${userId}, ${account.name}, ${email}, true, now(), now())
    `;
  }

  const existingCredential = await sql`
    select id from "account"
    where "userId" = ${userId} and "providerId" = 'credential'
    limit 1
  `;

  const passwordHash = await hashPassword({ password: account.password });

  if (existingCredential[0]) {
    await sql`
      update "account"
      set password = ${passwordHash}, "updatedAt" = now()
      where id = ${existingCredential[0].id}
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
        ${`credential-${randomBytes(8).toString("hex")}`},
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

async function main() {
  for (const account of accounts) {
    await ensureAgencyAccount(account);
  }
  console.log("Agency accounts ready:");
  for (const account of accounts) {
    console.log(`${account.email} / ${account.password}`);
  }
}

main().catch((error) => {
  console.error("Failed to seed agency accounts:", error);
  process.exit(1);
});

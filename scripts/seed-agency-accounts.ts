import { randomBytes } from "node:crypto";
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
] as const;

async function upsertAccount(account: (typeof accounts)[number]) {
  const sql = await getSql();

  const userRows = await sql<{ id: string }>`
    select id from "user" where email = ${account.email.toLowerCase()}
    limit 1
  `;

  let userId: string;
  if (userRows[0]) {
    userId = userRows[0].id;
    await sql`
      update "user"
      set name = ${account.name}, "updatedAt" = now()
      where id = ${userId}
    `;
  } else {
    userId = `agency-${randomBytes(8).toString("hex")}`;
    await sql`
      insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
      values (${userId}, ${account.name}, ${account.email.toLowerCase()}, true, now(), now())
    `;
  }

  const accountRows = await sql<{ id: string }>`
    select id from "account"
    where "userId" = ${userId} and "providerId" = 'credential'
    limit 1
  `;

  const passwordHash = await import("better-auth/crypto").then(({ hashPassword }) => hashPassword({ password: account.password }));

  if (accountRows[0]) {
    await sql`
      update "account"
      set password = ${passwordHash}, "updatedAt" = now()
      where id = ${accountRows[0].id}
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
    await upsertAccount(account);
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

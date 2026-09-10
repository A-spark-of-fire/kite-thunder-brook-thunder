import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { indianMobile } from "@/lib/utils";
import type { Address, MePayload, NotificationItem, Profile } from "@/lib/types";
import { mapAddress, mapNotification, mapProfile, mapSettings, num } from "./map";

const addressSchema = z.object({
  label: z.string().trim().min(1).max(40).default("Home"),
  line1: z.string().trim().min(3).max(160),
  line2: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80).default("West Bengal"),
  pincode: z.string().trim().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  landmark: z.string().trim().max(120).optional().default(""),
});

export async function ensureProfile(userId: string, hint?: { name?: string | null }): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into profiles (user_id, full_name)
    values (${userId}, ${hint?.name ?? ""})
    on conflict (user_id) do nothing
  `;
  if (hint?.name) {
    await sql`
      update profiles
      set full_name = case when full_name = '' then ${hint.name} else full_name end, updated_at = now()
      where user_id = ${userId}
    `;
  }
}

async function adminCount(): Promise<number> {
  const sql = await getSql();
  const rows = await sql<{ n: number }>`select count(*)::int as n from profiles where role in ('admin', 'staff')`;
  return num(rows[0]?.n);
}

export async function loadProfile(userId: string): Promise<Profile> {
  const sql = await getSql();
  await ensureProfile(userId);
  const rows = await sql<Record<string, unknown>>`
    select p.user_id, p.role, p.full_name, p.mobile, p.alt_mobile, u.email, u.image
    from profiles p
    left join "user" u on u.id = p.user_id
    where p.user_id = ${userId}
    limit 1
  `;
  const addrRows = await sql<Record<string, unknown>>`
    select * from addresses where user_id = ${userId} order by is_default desc, id asc limit 1
  `;
  const address: Address | null = addrRows[0] ? mapAddress(addrRows[0]) : null;
  const admins = await adminCount();
  const role = String(rows[0]?.role ?? "customer");
  return mapProfile(rows[0] ?? { user_id: userId }, {
    canAccessAdmin: role === "admin" || role === "staff" || admins === 0,
    adminExists: admins > 0,
    address,
  });
}

export async function requireAdmin(userId: string): Promise<Profile> {
  const profile = await loadProfile(userId);
  if (profile.role !== "admin" && profile.role !== "staff") throw new Error("Forbidden");
  return profile;
}

export const ensureAgencyDesk = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      const { seedAgencyAccounts } = await import("@/lib/auth/seed-agency");
      await seedAgencyAccounts();
    } catch (err) {
      console.warn("Agency desk account seeding skipped/failed:", err);
    }
    return { ok: true as const };
  });


export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MePayload> => {
    try {
      const { seedAgencyAccounts } = await import("@/lib/auth/seed-agency");
      await seedAgencyAccounts();
    } catch (err) {
      console.warn("Agency desk account seeding skipped/failed in getMe:", err);
    }
    const sql = await getSql();
    const profile = await loadProfile(context.userId);
    const settingsRows = await sql<Record<string, unknown>>`select * from agency_settings where id = 1`;
    const unread = await sql<{ n: number }>`select count(*)::int as n from notifications where user_id = ${context.userId} and is_read = false`;
    return { profile, settings: mapSettings(settingsRows), unreadCount: num(unread?.n) };
  });


export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({
      fullName: z.string().trim().min(2).max(80),
      mobile: z.string().trim().refine(indianMobile, "Enter a valid 10-digit mobile number"),
      altMobile: z.string().trim().optional().default("").refine((v) => !v || indianMobile(v), "Enter a valid alternate number"),
    }).parse(input),
  )
  .handler(async ({ context, data }): Promise<Profile> => {
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

export const saveMyAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => addressSchema.parse(input))
  .handler(async ({ context, data }): Promise<Profile> => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    const existing = await sql<{ id: number }>`
      select id from addresses where user_id = ${context.userId} order by is_default desc, id asc limit 1
    `;
    if (existing[0]) {
      await sql`
        update addresses set label = ${data.label}, line1 = ${data.line1}, line2 = ${data.line2 ?? ""},
          city = ${data.city}, state = ${data.state}, pincode = ${data.pincode},
          landmark = ${data.landmark ?? ""}, is_default = true
        where id = ${existing[0].id} and user_id = ${context.userId}
      `;
    } else {
      await sql`
        insert into addresses (user_id, label, line1, line2, city, state, pincode, landmark, is_default)
        values (${context.userId}, ${data.label}, ${data.line1}, ${data.line2 ?? ""},
          ${data.city}, ${data.state}, ${data.pincode}, ${data.landmark ?? ""}, true)
      `;
    }
    return loadProfile(context.userId);
  });

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<NotificationItem[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from notifications where user_id = ${context.userId} order by created_at desc limit 40
    `;
    return rows.map(mapNotification);
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update notifications set is_read = true where user_id = ${context.userId} and is_read = false`;
    return { ok: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({
      name: z.string().trim().min(2).max(80),
      phone: z.string().trim().refine(indianMobile, "Enter a valid mobile number"),
      email: z.string().trim().email().optional().or(z.literal("")),
      message: z.string().trim().min(8).max(1000),
    }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into contact_messages (user_id, name, phone, email, message)
      values (${context.userId}, ${data.name}, ${data.phone}, ${data.email ?? ""}, ${data.message})
    `;
    return { ok: true };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ email: z.string().trim().email() }).parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into password_reset_requests (email) values (${data.email.toLowerCase()})`;
    return { ok: true };
  });

export const claimAdminDesk = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Profile> => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    if ((await adminCount()) > 0) throw new Error("An agency administrator already exists.");
    await sql`update profiles set role = 'admin', updated_at = now() where user_id = ${context.userId}`;
    return loadProfile(context.userId);
  });

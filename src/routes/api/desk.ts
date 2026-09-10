import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import { seedAgencyAccounts, isAgencyStaffEmail } from "@/lib/auth/seed-agency";
import { getSessionUser } from "@/lib/auth/verify.server";
import { loadProfile } from "@/lib/server/profile";

function originOf(request: Request): URL {
  return new URL(request.url);
}

function redirectTo(request: Request, path: string): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: new URL(path, originOf(request)).toString() },
  });
}

export const Route = createFileRoute("/api/desk")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await seedAgencyAccounts();
        const user = await getSessionUser();
        if (user) {
          const profile = await loadProfile(user.id);
          if (profile.role === "admin" || profile.role === "staff") {
            return redirectTo(request, "/admin");
          }
        }
        return redirectTo(request, "/kse-ops");
      },
      POST: async ({ request }) => {
        await seedAgencyAccounts();
        let body: { email?: string; password?: string };
        try {
          body = (await request.json()) as { email?: string; password?: string };
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const email = String(body.email ?? "").trim().toLowerCase();
        const password = String(body.password ?? "");
        if (!email || !password) {
          return Response.json({ ok: false, error: "Email and password required" }, { status: 400 });
        }
        if (!isAgencyStaffEmail(email)) {
          return Response.json({ ok: false, error: "Not an agency desk account" }, { status: 403 });
        }
        const result = await auth.api.signInEmail({
          body: { email, password },
          headers: request.headers,
          asResponse: true,
        });
        if (!result.ok) {
          return Response.json({ ok: false, error: "Invalid agency credentials" }, { status: 401 });
        }
        const headers = new Headers(result.headers);
        headers.set("content-type", "application/json");
        return new Response(JSON.stringify({ ok: true, redirect: "/admin" }), {
          status: 200,
          headers,
        });
      },
    },
  },
});

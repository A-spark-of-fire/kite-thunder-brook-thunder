import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMe } from "@/lib/queries";


export const Route = createFileRoute("/kse-ops")({
  component: AgencyOpsPage,
});

function AgencyOpsPage() {
  const { user, isPending } = useCurrentUserState();
  const me = useMe(Boolean(user) && !isPending);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const role = me.data?.profile.role;
  const isStaff = role === "admin" || role === "staff";

  useEffect(() => {
    if (!isPending && user && isStaff) void navigate({ to: "/admin" });
  }, [isPending, user, isStaff, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/desk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "Could not open the agency desk");
      }
      await authClient.getSession();
      window.location.assign("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the agency desk");
      setBusy(false);
    }
  }

  return (
    <div className="navy-wash grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8">
        <BrandLockup />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Internal</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Agency operations</h1>
        <p className="mt-1 text-sm text-muted">Staff sign-in for the Kalpataru delivery desk.</p>
        {authEnabled ? (
          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <Field label="Desk email">
              <Input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <Input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Opening desk…" : "Open agency desk"}</Button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted">The desk is offline.</p>
        )}
      </div>
    </div>
  );
}

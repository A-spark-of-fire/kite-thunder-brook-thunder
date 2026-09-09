import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AGENCY } from "@/lib/agency";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) void navigate({ to: "/" });
  }, [isPending, user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: err } = await authClient.signIn.email({ email, password });
      if (err) throw new Error(err.message || "Could not sign in");
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
      setBusy(false);
    }
  }

  return (
    <div className="navy-wash grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8">
        <BrandLockup />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to order SUPEYO water and track deliveries.</p>
        {authEnabled ? (
          <>
            <form className="mt-6 space-y-3" onSubmit={onSubmit}>
              <Field label="Email"><Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
              <Field label="Password"><Input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
            </form>
            <div className="mt-3 flex justify-between text-sm">
              <Link to="/forgot-password" className="text-brand">Forgot password?</Link>
              <Link to="/register" className="text-brand">Create account</Link>
            </div>
            <div className="relative my-6">
              <div className="h-px bg-line" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-2 text-xs text-muted">or continue with</span>
            </div>
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button key={p.providerId} type="button" variant="secondary" onClick={() => signIn(p.providerId, { callbackURL: "/" })}>
                  Continue with {p.label}
                </Button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-line bg-ice p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Agency desk access</p>
              <Link to="/agency-login" className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-navy px-4 py-3 text-sm font-medium text-paper hover:opacity-95">
                Open agency desk login
              </Link>
              <p className="mt-3 text-xs text-muted">Approved accounts only: agency.admin@supeyo.in / AgencyDesk!2026 and agency.staff@supeyo.in / DeskStaff!2026</p>
            </div>
          </>
        ) : <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>}
        <p className="mt-6 text-center text-xs text-muted">{AGENCY.company} · {AGENCY.phones[0]}</p>
        <p className="mt-2 text-center text-xs text-muted">
          Need agency access? <Link to="/agency-login" className="font-medium text-brand underline-offset-4 hover:underline">Agency desk login</Link>
        </p>
      </div>
    </div>
  );
}

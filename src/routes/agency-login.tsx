import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import {
  AGENCY_DESK_ACCOUNTS,
  clearAgencyDeskSession,
  getAgencyDeskSession,
  isAgencyDeskCredentials,
  setAgencyDeskSession,
} from "@/lib/agency-auth";

export const Route = createFileRoute("/agency-login")({
  component: AgencyLoginPage,
});

function AgencyLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sessionUser = getAgencyDeskSession();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const valid = isAgencyDeskCredentials(username, password);
      if (!valid) {
        throw new Error("Invalid agency desk username or password");
      }

      const matched = AGENCY_DESK_ACCOUNTS.find(
        (account) => account.username.toLowerCase() === username.trim().toLowerCase(),
      );
      if (!matched) {
        throw new Error("Agency access not authorized");
      }

      setAgencyDeskSession(matched.username);
      navigate({ to: "/admin" });
    } catch (err) {
      clearAgencyDeskSession();
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  if (sessionUser) {
    return (
      <div className="navy-wash grid min-h-dvh place-items-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8">
          <BrandLockup />
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Agency desk is active</h1>
          <p className="mt-2 text-sm text-muted">Your agency account is already signed in.</p>
          <Button className="mt-6 w-full" onClick={() => void navigate({ to: "/admin" })}>Open agency desk</Button>
          <Button type="button" variant="secondary" className="mt-3 w-full" onClick={() => { clearAgencyDeskSession(); setUsername(""); setPassword(""); setError(null); }}>
            Sign out agency session
          </Button>
          <div className="mt-5 text-center text-sm">
            <Link to="/" className="text-brand hover:underline">Back to customer portal</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="navy-wash grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8">
        <BrandLockup />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Agency desk login</h1>
        <p className="mt-1 text-sm text-muted">Use the approved agency account only.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <Field label="Username">
            <Input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="agency.admin@supeyo.in"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter agency password"
            />
          </Field>

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Access agency desk"}
          </Button>
        </form>

        <div className="mt-5 rounded-2xl border border-line bg-ice p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Approved accounts</p>
          <div className="mt-3 space-y-2 text-xs text-muted">
            <p>Admin: agency.admin@supeyo.in / AgencyDesk!2026</p>
            <p>Staff: agency.staff@supeyo.in / DeskStaff!2026</p>
          </div>
        </div>

        <div className="mt-5 text-center text-sm">
          <Link to="/" className="text-brand hover:underline">Back to customer portal</Link>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Phone } from "lucide-react";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { AGENCY } from "@/lib/agency";
import { requestPasswordReset } from "@/lib/server/profile";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try { await requestPasswordReset({ data: { email } }); setDone(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not submit request"); }
    finally { setBusy(false); }
  }

  return (
    <div className="navy-wash grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] bg-paper p-6 shadow-float sm:p-8">
        <BrandLockup />
        <h1 className="mt-6 font-display text-2xl font-semibold">Reset password</h1>
        {done ? (
          <div className="mt-4 space-y-3 text-sm text-ink">
            <p>We have received your request for {email}.</p>
            <p className="text-muted">Call {AGENCY.company} and we will help you sign back in.</p>
            <a href={`tel:${AGENCY.phones[0]}`} className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 font-medium text-paper">
              <Phone className="size-4" /> Call {AGENCY.phones[0]}
            </a>
          </div>
        ) : (
          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <Field label="Account email" hint="We will notify the agency desk to reset access.">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Sending…" : "Request reset"}</Button>
          </form>
        )}
        <p className="mt-5 text-center text-sm"><Link to="/login" className="text-brand">Back to sign in</Link></p>
      </div>
    </div>
  );
}

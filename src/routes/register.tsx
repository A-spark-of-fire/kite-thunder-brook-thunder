import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { saveMyAddress, updateMyProfile } from "@/lib/server/profile";
import { indianMobile } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", mobile: "", email: "", password: "",
    line1: "", city: "Kalinagar / Taherpur", pincode: "741254", landmark: "",
  });
  function set<K extends keyof typeof form>(key: K, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!indianMobile(form.mobile)) { setError("Enter a valid 10-digit mobile number."); return; }
    setBusy(true);
    try {
      const { error: err } = await authClient.signUp.email({ email: form.email, password: form.password, name: form.fullName });
      if (err) throw new Error(err.message || "Could not create account");
      await updateMyProfile({ data: { fullName: form.fullName, mobile: form.mobile, altMobile: "" } });
      await saveMyAddress({ data: { label: "Home", line1: form.line1, line2: "", city: form.city, state: "West Bengal", pincode: form.pincode, landmark: form.landmark } });
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
      setBusy(false);
    }
  }

  return (
    <div className="navy-wash min-h-dvh px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8">
        <BrandLockup />
        <h1 className="mt-6 font-display text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted">A few details so we can deliver water to your door.</p>
        {authEnabled ? (
          <>
            <form className="mt-6 space-y-3" onSubmit={onSubmit}>
              <Field label="Full name"><Input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
              <Field label="Mobile number"><Input required inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} /></Field>
              <Field label="Email"><Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Password" hint="At least 8 characters"><Input type="password" required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} /></Field>
              <Field label="Delivery address"><Input required placeholder="House / road / area" value={form.line1} onChange={(e) => set("line1", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City / town"><Input required value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
                <Field label="PIN code"><Input required inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} /></Field>
              </div>
              <Field label="Landmark (optional)"><Input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} /></Field>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
            </form>
            <p className="mt-3 text-center text-sm text-muted">Already registered? <Link to="/login" className="text-brand">Sign in</Link></p>
          </>
        ) : <p className="mt-4 text-sm text-muted">Registration is disabled.</p>}
      </div>
    </div>
  );
}

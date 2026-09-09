import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/layout/customer-shell";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { PageSkeleton } from "@/components/ui/skeleton";
import { AGENCY } from "@/lib/agency";
import { useMe } from "@/lib/queries";
import { saveMyAddress, updateMyProfile } from "@/lib/server/profile";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  return <CustomerShell><ProfileForm /></CustomerShell>;
}

function ProfileForm() {
  const me = useMe();
  const qc = useQueryClient();
  const profile = me.data?.profile;
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: "", mobile: "", altMobile: "", label: "Home",
    line1: "", line2: "", city: "", state: "West Bengal", pincode: "", landmark: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName, mobile: profile.mobile, altMobile: profile.altMobile,
      label: profile.address?.label ?? "Home", line1: profile.address?.line1 ?? "",
      line2: profile.address?.line2 ?? "", city: profile.address?.city ?? "",
      state: profile.address?.state ?? "West Bengal", pincode: profile.address?.pincode ?? "",
      landmark: profile.address?.landmark ?? "",
    });
  }, [profile]);

  if (me.isLoading) return <PageSkeleton />;
  function set<K extends keyof typeof form>(key: K, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  async function save() {
    setBusy(true);
    try {
      await updateMyProfile({ data: { fullName: form.fullName, mobile: form.mobile, altMobile: form.altMobile } });
      await saveMyAddress({ data: { label: form.label || "Home", line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, landmark: form.landmark } });
      await qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted">{profile?.email}</p>
      </div>
      <Card className="space-y-3">
        <Field label="Full name"><Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
        <Field label="Mobile number"><Input inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} /></Field>
        <Field label="Alternate number (optional)"><Input inputMode="numeric" maxLength={10} value={form.altMobile} onChange={(e) => set("altMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} /></Field>
      </Card>
      <Card className="space-y-3">
        <p className="font-display font-semibold">Delivery address</p>
        <Field label="Label"><Input value={form.label} onChange={(e) => set("label", e.target.value)} /></Field>
        <Field label="Address line"><Input value={form.line1} onChange={(e) => set("line1", e.target.value)} /></Field>
        <Field label="Area / locality (optional)"><Input value={form.line2} onChange={(e) => set("line2", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="PIN"><Input inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} /></Field>
        </div>
        <Field label="State"><Input value={form.state} onChange={(e) => set("state", e.target.value)} /></Field>
        <Field label="Landmark"><Input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} /></Field>
      </Card>
      <Button className="w-full" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save profile"}</Button>
      <Card className="flex items-center justify-between">
        <div><p className="text-sm font-medium">Need help?</p><p className="text-xs text-muted">{AGENCY.phones[0]}</p></div>
        <Button asChild variant="secondary" size="sm"><Link to="/contact">Contact</Link></Button>
      </Card>
      <SignOutButton />
    </div>
  );
}

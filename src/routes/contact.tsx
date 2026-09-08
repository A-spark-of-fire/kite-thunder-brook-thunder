import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/layout/customer-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { AGENCY } from "@/lib/agency";
import { useMe } from "@/lib/queries";
import { submitContact } from "@/lib/server/profile";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return <CustomerShell><ContactInner /></CustomerShell>;
}

function ContactInner() {
  const me = useMe();
  const s = me.data?.settings;
  const profile = me.data?.profile;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const agencyPhone = s?.phonePrimary ?? AGENCY.phones[0];
  const phone2 = s?.phoneSecondary ?? AGENCY.phones[1];
  const email = s?.email ?? AGENCY.email;
  const address = s?.addressLine ?? AGENCY.address;

  async function send() {
    setBusy(true);
    try {
      await submitContact({ data: { name: profile?.fullName || "Customer", phone: profile?.mobile || callerPhone, email: profile?.email ?? "", message } });
      setMessage("");
      toast.success("Message sent to the agency");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Contact the agency</h1>
        <p className="text-sm text-muted">{s?.companyName ?? AGENCY.company}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`tel:${agencyPhone}`} className="rounded-3xl border border-line bg-paper p-4 shadow-card">
          <Phone className="size-5 text-cyan" /><p className="mt-2 font-semibold">{agencyPhone}</p><p className="text-xs text-muted">Primary</p>
        </a>
        <a href={`tel:${phone2}`} className="rounded-3xl border border-line bg-paper p-4 shadow-card">
          <Phone className="size-5 text-cyan" /><p className="mt-2 font-semibold">{phone2}</p><p className="text-xs text-muted">Alternate</p>
        </a>
      </div>
      <Card className="space-y-3">
        <div className="flex gap-3 text-sm"><Mail className="mt-0.5 size-4 text-cyan" /><a href={`mailto:${email}`} className="text-brand">{email}</a></div>
        <div className="flex gap-3 text-sm"><MapPin className="mt-0.5 size-4 text-cyan" /><p>{address}</p></div>
        <p className="text-xs text-muted">Proprietor {s?.proprietor ?? AGENCY.proprietor}</p>
      </Card>
      <Card className="space-y-3">
        <p className="font-display font-semibold">Send a message</p>
        {!profile?.mobile ? (
          <Field label="Your mobile">
            <Input inputMode="numeric" maxLength={10} value={callerPhone} onChange={(e) => setCallerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </Field>
        ) : null}
        <Field label="Your message">
          <Textarea minLength={8} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask about a delivery, jar refill, or bulk order…" />
        </Field>
        <Button className="w-full" disabled={busy || message.trim().length < 8} onClick={send}>{busy ? "Sending…" : "Send message"}</Button>
      </Card>
    </div>
  );
}

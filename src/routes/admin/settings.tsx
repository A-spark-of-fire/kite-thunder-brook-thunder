import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { adminGetSettings, adminListAgents, adminListInbox, adminListPayments, adminSaveAgent, adminSaveSettings, adminTogglePayment } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettingsPage });

function AdminSettingsPage() {
  const qc = useQueryClient();
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: () => adminGetSettings() });
  const payments = useQuery({ queryKey: ["admin-payments"], queryFn: () => adminListPayments() });
  const agents = useQuery({ queryKey: ["admin-agents"], queryFn: () => adminListAgents() });
  const inbox = useQuery({ queryKey: ["admin-inbox"], queryFn: () => adminListInbox() });
  const [form, setForm] = useState({ brandName: "", companyName: "", proprietor: "", phonePrimary: "", phoneSecondary: "", email: "", addressLine: "", fssai: "", upiId: "" });
  const [agent, setAgent] = useState({ name: "", phone: "" });
  useEffect(() => { if (settings.data) setForm(settings.data); }, [settings.data]);

  const save = useMutation({
    mutationFn: () => adminSaveSettings({ data: form }),
    onSuccess: async () => { toast.success("Agency details saved"); await qc.invalidateQueries({ queryKey: ["admin-settings"] }); await qc.invalidateQueries({ queryKey: ["settings-public"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const togglePay = useMutation({
    mutationFn: (p: { id: string; enabled: boolean }) => adminTogglePayment({ data: p }),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["admin-payments"] }); await qc.invalidateQueries({ queryKey: ["payments"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const addAgent = useMutation({
    mutationFn: () => adminSaveAgent({ data: { name: agent.name, phone: agent.phone, isActive: true } }),
    onSuccess: async () => { setAgent({ name: "", phone: "" }); toast.success("Delivery person added"); await qc.invalidateQueries({ queryKey: ["admin-agents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <Card className="space-y-3">
        <p className="font-display font-semibold">Agency details</p>
        <Field label="Brand"><Input value={form.brandName} onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))} /></Field>
        <Field label="Company"><Input value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} /></Field>
        <Field label="Proprietor"><Input value={form.proprietor} onChange={(e) => setForm((f) => ({ ...f, proprietor: e.target.value }))} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone"><Input value={form.phonePrimary} onChange={(e) => setForm((f) => ({ ...f, phonePrimary: e.target.value }))} /></Field>
          <Field label="Alternate"><Input value={form.phoneSecondary} onChange={(e) => setForm((f) => ({ ...f, phoneSecondary: e.target.value }))} /></Field>
        </div>
        <Field label="Email"><Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></Field>
        <Field label="Address"><Input value={form.addressLine} onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))} /></Field>
        <Field label="FSSAI"><Input value={form.fssai} onChange={(e) => setForm((f) => ({ ...f, fssai: e.target.value }))} /></Field>
        <Field label="UPI ID (optional)"><Input value={form.upiId} onChange={(e) => setForm((f) => ({ ...f, upiId: e.target.value }))} /></Field>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save details"}</Button>
      </Card>
      <Card className="space-y-3">
        <p className="font-display font-semibold">Payment methods</p>
        <p className="text-sm text-muted">Choose what customers can pick at checkout. Cash on Delivery stays on.</p>
        <ul className="space-y-2">
          {(payments.data ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-2">
              <span><span className="block text-sm font-semibold">{p.label}</span><span className="text-xs text-muted">{p.description}</span></span>
              <label className="text-sm"><input type="checkbox" checked={p.enabled} onChange={(e) => togglePay.mutate({ id: p.id, enabled: e.target.checked })} /> On</label>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="space-y-3">
        <p className="font-display font-semibold">Delivery team</p>
        <ul className="space-y-2 text-sm">
          {(agents.data ?? []).map((a) => (
            <li key={a.id} className="flex justify-between rounded-2xl border border-line px-3 py-2">
              <span>{a.name}<span className="block text-xs text-muted">{a.phone}</span></span>
              <span className="text-xs text-muted">{a.isActive ? "Active" : "Off"}</span>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Name" value={agent.name} onChange={(e) => setAgent((s) => ({ ...s, name: e.target.value }))} />
          <Input placeholder="Phone" value={agent.phone} onChange={(e) => setAgent((s) => ({ ...s, phone: e.target.value }))} />
        </div>
        <Button variant="secondary" onClick={() => addAgent.mutate()} disabled={addAgent.isPending}>Add delivery person</Button>
      </Card>
      <Card className="space-y-3">
        <p className="font-display font-semibold">Customer messages</p>
        {(inbox.data?.messages ?? []).length === 0 ? <p className="text-sm text-muted">No messages.</p> : (
          <ul className="space-y-2">
            {inbox.data!.messages.map((m) => (
              <li key={m.id} className="rounded-2xl border border-line p-3 text-sm">
                <p className="font-semibold">{m.name} · {m.phone}</p>
                <p className="text-muted">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

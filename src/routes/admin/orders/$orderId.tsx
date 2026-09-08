import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AddressBlock } from "@/components/order/address-block";
import { StatusBadge } from "@/components/order/status-badge";
import { DeliveryTimeline } from "@/components/order/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { PageSkeleton } from "@/components/ui/skeleton";
import { ORDER_STATUSES, STATUS_META, TIME_SLOTS, type OrderStatus } from "@/lib/agency";
import { adminGetOrder, adminListAgents, adminUpdateOrder } from "@/lib/server/admin";
import { formatDateTime, inr } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/$orderId")({ component: AdminOrderDetail });

function AdminOrderDetail() {
  const { orderId } = Route.useParams();
  const id = Number(orderId);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-order", id], queryFn: () => adminGetOrder({ data: { id } }), enabled: Number.isFinite(id) });
  const agents = useQuery({ queryKey: ["admin-agents"], queryFn: () => adminListAgents() });
  const o = q.data;
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [agentId, setAgentId] = useState("");

  const save = useMutation({
    mutationFn: () => adminUpdateOrder({
      data: {
        id,
        status: (status || o?.status) as OrderStatus,
        preferredDate: date || o?.preferredDate,
        timeSlot: (slot || o?.timeSlot) as "morning" | "afternoon" | "evening",
        assignedAgentId: agentId === "" ? o?.assignedAgent?.id ?? null : agentId === "none" ? null : Number(agentId),
      },
    }),
    onSuccess: async () => {
      toast.success("Order updated");
      await qc.invalidateQueries({ queryKey: ["admin-order", id] });
      await qc.invalidateQueries({ queryKey: ["admin-orders"] });
      await qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) return <PageSkeleton />;
  if (!o) return <Card>Order not found. <Link to="/admin/orders" className="text-brand">Back</Link></Card>;

  return (
    <div className="space-y-4">
      <Link to="/admin/orders" className="text-sm text-brand">← Orders</Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-brand">{o.orderNumber}</p>
          <h1 className="font-display text-2xl font-semibold">{o.customerName || "Customer"}</h1>
          <p className="text-sm text-muted">{o.customerMobile} · placed {formatDateTime(o.createdAt)}</p>
        </div>
        <StatusBadge status={o.status} />
      </div>
      <Card><DeliveryTimeline status={o.status} /></Card>
      <Card className="space-y-3">
        <Field label="Status">
          <select className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm" value={status || o.status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
          </select>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Delivery date">
            <input type="date" className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm" value={date || o.preferredDate} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Time slot">
            <select className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm" value={slot || o.timeSlot} onChange={(e) => setSlot(e.target.value)}>
              {TIME_SLOTS.map((t) => <option key={t.id} value={t.id}>{t.label} · {t.hint}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Assign delivery person">
          <select className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm" value={agentId || (o.assignedAgent ? String(o.assignedAgent.id) : "none")} onChange={(e) => setAgentId(e.target.value)}>
            <option value="none">Unassigned</option>
            {(agents.data ?? []).filter((a) => a.isActive || a.id === o.assignedAgent?.id).map((a) => (
              <option key={a.id} value={a.id}>{a.name} · {a.phone}</option>
            ))}
          </select>
        </Field>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Update order"}</Button>
      </Card>
      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Items</p>
        <ul className="divide-y divide-line text-sm">
          {o.items.map((i) => <li key={i.id} className="flex justify-between py-2"><span>{i.quantity} × {i.productName}</span><span className="tabular-nums">{inr(i.lineTotal)}</span></li>)}
        </ul>
        <p className="mt-2 text-right font-semibold tabular-nums">{inr(o.total)}</p>
      </Card>
      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Address</p>
        <AddressBlock address={o.address} name={o.customerName} />
      </Card>
    </div>
  );
}

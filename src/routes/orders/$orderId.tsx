import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Phone, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddressBlock } from "@/components/order/address-block";
import { StatusBadge } from "@/components/order/status-badge";
import { DeliveryTimeline } from "@/components/order/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { CANCELABLE_STATUSES, slotHint } from "@/lib/agency";
import { useMe, useMyOrder } from "@/lib/queries";
import { cancelMyOrder } from "@/lib/server/orders";
import { formatDate, formatDateTime, inr } from "@/lib/utils";

export const Route = createFileRoute("/orders/$orderId")({ component: OrderDetailPage });

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const id = Number(orderId);
  const q = useMyOrder(id, Number.isFinite(id));
  const me = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!Number.isFinite(id)) return <p className="text-sm text-muted">Invalid order.</p>;
  if (q.isLoading) return <PageSkeleton />;
  if (q.error || !q.data) {
    return (
      <Card>
        <p className="font-medium">We could not find that order.</p>
        <Button asChild className="mt-3" variant="secondary"><Link to="/orders">Back to my orders</Link></Button>
      </Card>
    );
  }
  const o = q.data;
  const canCancel = CANCELABLE_STATUSES.includes(o.status as (typeof CANCELABLE_STATUSES)[number]);

  async function onCancel() {
    if (!confirm("Cancel this order? You can place a new one any time.")) return;
    setBusy(true);
    try {
      await cancelMyOrder({ data: { id, reason: "Cancelled by customer" } });
      toast.success("Order cancelled");
      await qc.invalidateQueries({ queryKey: ["my-order", id] });
      await qc.invalidateQueries({ queryKey: ["my-orders"] });
      await qc.invalidateQueries({ queryKey: ["current-delivery"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel");
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <button type="button" className="text-sm text-brand" onClick={() => navigate({ to: "/orders" })}>← My orders</button>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-brand">{o.orderNumber}</p>
          <h1 className="font-display text-2xl font-semibold">Delivery details</h1>
          <p className="text-sm text-muted">Placed {formatDateTime(o.createdAt)}</p>
        </div>
        <StatusBadge status={o.status} />
      </div>
      <Card className="space-y-4">
        <DeliveryTimeline status={o.status} />
        <p className="text-sm text-muted">Expected {formatDate(o.expectedDate ?? o.preferredDate)} · {slotHint(o.timeSlot)}</p>
      </Card>
      <Card className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Items</p>
        <ul className="divide-y divide-line">
          {o.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span><span className="font-medium">{item.productName}</span><span className="block text-xs text-muted">{item.sizeLabel} · {item.quantity} × {inr(item.unitPrice)}</span></span>
              <span className="font-semibold tabular-nums">{inr(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-1 text-sm font-semibold"><span>Total</span><span className="tabular-nums">{inr(o.total)}</span></div>
        <p className="text-xs text-muted">Payment: {o.paymentMethod.toUpperCase()} · {o.paymentStatus}</p>
      </Card>
      <Card>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Deliver to</p>
        <AddressBlock address={o.address} name={me.data?.profile.fullName} />
      </Card>
      {o.assignedAgent ? (
        <Card className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-foam text-brand"><Truck className="size-5" /></span>
            <div>
              <p className="text-sm font-semibold">{o.assignedAgent.name}</p>
              <p className="text-xs text-muted">Delivery partner</p>
            </div>
          </div>
          <a href={`tel:${o.assignedAgent.phone}`} className="grid size-11 place-items-center rounded-xl bg-brand text-paper" aria-label="Call delivery partner"><Phone className="size-4" /></a>
        </Card>
      ) : null}
      {o.note ? <Card><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Your note</p><p className="mt-2 text-sm">{o.note}</p></Card> : null}
      {canCancel ? <Button variant="danger" className="w-full" disabled={busy} onClick={onCancel}>{busy ? "Cancelling…" : "Cancel order"}</Button> : null}
    </div>
  );
}

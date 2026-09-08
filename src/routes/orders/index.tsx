import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/order/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { slotLabel } from "@/lib/agency";
import { useMyOrders } from "@/lib/queries";
import { formatDate, inr } from "@/lib/utils";

export const Route = createFileRoute("/orders/")({ component: OrdersList });

function OrdersList() {
  const q = useMyOrders();
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">My orders</h1>
          <p className="text-sm text-muted">Only you can see these deliveries.</p>
        </div>
        <Button asChild size="sm"><Link to="/order">New order</Link></Button>
      </div>
      {q.isLoading ? (
        <div className="space-y-3"><Skeleton className="h-28 rounded-3xl" /><Skeleton className="h-28 rounded-3xl" /></div>
      ) : (q.data ?? []).length === 0 ? (
        <Card className="py-10 text-center">
          <p className="font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted">Your first SUPEYO delivery is a tap away.</p>
          <Button asChild className="mt-4"><Link to="/order">Order water</Link></Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {q.data!.map((o) => {
            const qty = o.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <li key={o.id}>
                <Card className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display font-semibold text-brand">{o.orderNumber}</p>
                      <p className="text-xs text-muted">{formatDate(o.createdAt)}</p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-sm text-ink">{o.items.map((i) => i.productName).join(", ")}</p>
                  <dl className="grid grid-cols-3 gap-2 text-xs text-muted">
                    <div><dt>Qty</dt><dd className="font-semibold text-ink tabular-nums">{qty}</dd></div>
                    <div><dt>Total</dt><dd className="font-semibold text-ink tabular-nums">{inr(o.total)}</dd></div>
                    <div><dt>Delivery</dt><dd className="font-semibold text-ink">{formatDate(o.preferredDate)}<span className="block font-normal text-muted">{slotLabel(o.timeSlot)}</span></dd></div>
                  </dl>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/orders/$orderId" params={{ orderId: String(o.id) }}>View details</Link>
                  </Button>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

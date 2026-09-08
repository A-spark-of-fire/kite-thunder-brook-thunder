import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StatusBadge } from "@/components/order/status-badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUSES, STATUS_META } from "@/lib/agency";
import { adminListOrders } from "@/lib/server/admin";
import { cn, formatDate, inr } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/")({ component: AdminOrdersPage });

function AdminOrdersPage() {
  const [status, setStatus] = useState("all");
  const q = useQuery({ queryKey: ["admin-orders", status], queryFn: () => adminListOrders({ data: { status } }) });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Orders</h1>
      <div className="flex gap-1 overflow-auto pb-1">
        {["all", ...ORDER_STATUSES].map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", status === s ? "bg-navy text-paper" : "bg-paper text-muted border border-line")}>
            {s === "all" ? "All" : STATUS_META[s as keyof typeof STATUS_META].short}
          </button>
        ))}
      </div>
      {q.isLoading ? <Skeleton className="h-40 rounded-3xl" /> : (q.data ?? []).length === 0 ? (
        <Card><p className="text-sm text-muted">No orders in this view.</p></Card>
      ) : (
        <ul className="space-y-2">
          {q.data!.map((o) => (
            <li key={o.id}>
              <Link to="/admin/orders/$orderId" params={{ orderId: String(o.id) }} className="block rounded-3xl border border-line bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand">{o.orderNumber}</p>
                    <p className="text-sm text-ink">{o.customerName || "Customer"}</p>
                    <p className="text-xs text-muted">{formatDate(o.preferredDate)} · {inr(o.total)} · {o.items.map((i) => `${i.quantity}× ${i.productName}`).join(", ")}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

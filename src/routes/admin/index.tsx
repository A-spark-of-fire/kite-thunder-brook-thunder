import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Truck, Users } from "lucide-react";
import { StatusBadge } from "@/components/order/status-badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminListOrders, getAdminStats } from "@/lib/server/admin";
import { formatDate, inr } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: () => getAdminStats() });
  const incoming = useQuery({ queryKey: ["admin-orders", "incoming"], queryFn: () => adminListOrders({ data: { status: "placed" } }) });
  const s = stats.data;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Agency desk</h1>
        <p className="text-sm text-muted">Incoming orders, deliveries, and catalogue.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Incoming", value: s?.incoming, icon: ShoppingBag },
          { label: "On the road", value: s?.outForDelivery, icon: Truck },
          { label: "Delivered today", value: s?.deliveredToday, icon: Package },
          { label: "Customers", value: s?.customers, icon: Users },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <item.icon className="size-4 text-cyan" />
            {stats.isLoading ? <Skeleton className="mt-3 h-7 w-10" /> : <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{item.value ?? 0}</p>}
            <p className="text-xs text-muted">{item.label}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">New orders</h2>
        <Link to="/admin/orders" className="text-sm text-brand">View all</Link>
      </div>
      {incoming.isLoading ? <Skeleton className="h-32 rounded-3xl" /> : (incoming.data ?? []).length === 0 ? (
        <Card><p className="text-sm text-muted">No newly placed orders.</p></Card>
      ) : (
        <ul className="space-y-2">
          {incoming.data!.slice(0, 8).map((o) => (
            <li key={o.id}>
              <Link to="/admin/orders/$orderId" params={{ orderId: String(o.id) }} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                <span>
                  <span className="block font-semibold text-brand">{o.orderNumber}</span>
                  <span className="text-xs text-muted">{o.customerName} · {formatDate(o.preferredDate)} · {inr(o.total)}</span>
                </span>
                <StatusBadge status={o.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AddressBlock } from "@/components/order/address-block";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminListCustomers } from "@/lib/server/admin";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomersPage });

function AdminCustomersPage() {
  const q = useQuery({ queryKey: ["admin-customers"], queryFn: () => adminListCustomers() });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Customers</h1>
      {q.isLoading ? <Skeleton className="h-40 rounded-3xl" /> : (q.data ?? []).length === 0 ? (
        <Card><p className="text-sm text-muted">No customer accounts yet.</p></Card>
      ) : (
        <ul className="space-y-3">
          {q.data!.map((c) => (
            <li key={c.userId}>
              <Card className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{c.fullName || "Unnamed"}</p>
                    <p className="text-sm text-muted">{c.mobile || "No mobile"}</p>
                    <p className="text-xs text-muted">{c.email}</p>
                  </div>
                  <span className="rounded-full bg-foam px-2 py-0.5 text-xs font-semibold text-brand">{c.orderCount} orders</span>
                </div>
                <AddressBlock address={c.address} />
                <p className="text-[11px] text-muted">Joined {formatDate(c.createdAt)}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

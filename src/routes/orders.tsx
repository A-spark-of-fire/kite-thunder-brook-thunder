import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CustomerShell } from "@/components/layout/customer-shell";

export const Route = createFileRoute("/orders")({
  component: function OrdersLayout() {
    return (
      <CustomerShell>
        <Outlet />
      </CustomerShell>
    );
  },
});

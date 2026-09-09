import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { Droplets, LayoutDashboard, Package, Settings, ShoppingBag, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BrandLockup } from "@/components/brand/logo";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/skeleton";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMe } from "@/lib/queries";
import { claimAdminDesk } from "@/lib/server/profile";
import { AGENCY_DESK_ACCOUNTS, getAgencyDeskSession } from "@/lib/agency-auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/customers", label: "Customers", icon: Users, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const me = useMe(Boolean(user) && !isPending);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
  const claim = useMutation({
    mutationFn: () => claimAdminDesk(),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["me"] }); toast.success("Agency desk is ready."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const agencySession = getAgencyDeskSession();
  const hasAgencyAccess = AGENCY_DESK_ACCOUNTS.some((account) => account.username === agencySession);

  if (isPending || (user && me.isLoading)) {
    return <div className="navy-wash min-h-dvh"><PageSkeleton /></div>;
  }
  if (!hasAgencyAccess) {
    return <Navigate to="/agency-login" replace />;
  }
  if (!user && hasAgencyAccess) {
    // Agency access is session-based and should not be forced through the customer auth route.
  }
  const profile = me.data?.profile;

  if (profile && !profile.canAccessAdmin) {
    return (
      <div className="water-wash grid min-h-dvh place-items-center px-4">
        <div className="max-w-md rounded-3xl border border-line bg-paper p-8 text-center shadow-card">
          <Droplets className="mx-auto size-8 text-brand" />
          <h1 className="mt-3 font-display text-xl font-semibold">Staff only</h1>
          <p className="mt-2 text-sm text-muted">The agency desk is for SUPEYO staff.</p>
          <Button asChild className="mt-5"><Link to="/">Go to my portal</Link></Button>
        </div>
      </div>
    );
  }

  if (profile && !profile.adminExists) {
    return (
      <div className="water-wash grid min-h-dvh place-items-center px-4">
        <div className="max-w-md rounded-3xl border border-line bg-paper p-8 text-center shadow-card">
          <BrandLockup />
          <h1 className="mt-5 font-display text-xl font-semibold">Set up the agency desk</h1>
          <p className="mt-2 text-sm text-muted">No administrator yet. Claim the desk to manage products, orders, and deliveries.</p>
          <Button className="mt-5 w-full" onClick={() => claim.mutate()} disabled={claim.isPending}>
            {claim.isPending ? "Setting up…" : "Become administrator"}
          </Button>
          <Link to="/" className="mt-3 inline-block text-sm text-brand">Back to customer portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-ice md:grid md:grid-cols-[240px_1fr]">
      <aside className="navy-wash hidden flex-col text-paper md:flex">
        <div className="px-5 py-5">
          <BrandLockup inverted />
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-cyan-soft/80">Agency desk</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={cn("flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium", active ? "bg-paper/15 text-paper" : "text-cyan-soft/80 hover:bg-paper/10 hover:text-paper")}>
                <Icon className="size-4" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4">
          <Link to="/" className="text-xs text-cyan-soft/80 hover:text-paper">Open customer portal</Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
          <div className="md:hidden"><BrandLockup compact /></div>
          <p className="hidden text-sm text-muted md:block">Signed in as {profile?.fullName || user?.displayName || "Agency staff"}</p>
          <SignOutButton />
        </header>
        <nav className="flex gap-1 overflow-auto border-b border-line bg-paper px-2 py-2 md:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={cn("shrink-0 rounded-full px-3 py-1.5 text-sm font-medium", active ? "bg-navy text-paper" : "text-muted")}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5"><Outlet /></main>
      </div>
    </div>
  );
}

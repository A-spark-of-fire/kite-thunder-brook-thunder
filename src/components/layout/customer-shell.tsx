import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Package, ShoppingCart, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/brand/logo";
import { NotificationsBell } from "@/components/layout/notifications";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { PageSkeleton } from "@/components/ui/skeleton";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/order", label: "Order Water", icon: ShoppingCart },
  { to: "/orders", label: "My Orders", icon: Package },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function CustomerShell({
  children,
  requireAuth = true,
}: {
  children?: ReactNode;
  requireAuth?: boolean;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <div className="water-wash min-h-dvh">
        <header className="border-b border-line bg-paper/80 px-4 py-3"><BrandLockup compact /></header>
        <PageSkeleton />
      </div>
    );
  }
  if (requireAuth && !user) return <RedirectToSignIn />;

  return (
    <div className="water-wash min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" aria-label="SUPEYO home"><BrandLockup compact /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {(user ? NAV : NAV.filter((item) => item.to === "/" || item.to === "/order")).map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} className={cn("rounded-full px-3.5 py-2 text-sm font-medium transition-colors", active ? "bg-foam text-brand" : "text-muted hover:bg-ice hover:text-ink")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1">
            {user ? <NotificationsBell /> : null}
            {user ? <SignOutButton compact /> : (
              <Link to="/login" className="rounded-full bg-brand px-3.5 py-2 text-sm font-medium text-paper">Sign in</Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:pb-12">
        {children ?? <Outlet />}
      </main>
      {user ? (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-brand" : "text-muted")}>
                    <Icon className="size-5" />
                    {item.label === "Order Water" ? "Order" : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

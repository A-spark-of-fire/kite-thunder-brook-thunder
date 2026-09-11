import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Droplets, HeartPulse, Leaf, Phone, ShieldCheck, Truck } from "lucide-react";
import { BrandLockup } from "@/components/brand/logo";
import { ProductArt } from "@/components/brand/product-art";
import { CustomerShell } from "@/components/layout/customer-shell";
import { AddressBlock } from "@/components/order/address-block";
import { StatusBadge } from "@/components/order/status-badge";
import { DeliveryTimeline } from "@/components/order/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AGENCY, slotHint } from "@/lib/agency";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useCurrentDelivery, useMe, useProducts, usePublicSettings } from "@/lib/queries";
import { formatDate, inr } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <CustomerShell requireAuth={false}><Skeleton className="h-48 w-full rounded-3xl" /></CustomerShell>;
  }
  if (!user) return <MarketingHome />;
  return <CustomerShell><CustomerHome name={user.displayName} /></CustomerShell>;
}

function CustomerHome({ name }: { name: string | null }) {
  const me = useMe();
  const current = useCurrentDelivery();
  const products = useProducts();
  const profile = me.data?.profile;
  const settings = me.data?.settings;
  const incomplete = profile && (!profile.mobile || !profile.address);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-card">
        <div className="navy-wash relative px-5 py-6 text-paper">
          <p className="text-sm text-cyan-soft/90">Namaskar</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{profile?.fullName || name || "Customer"}</h1>
          <p className="mt-1 max-w-md text-sm text-cyan-soft/80">{AGENCY.promise}</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <Button asChild size="lg" className="h-14"><Link to="/order">Order Water <ArrowRight className="size-4" /></Link></Button>
          <Button asChild size="lg" variant="secondary" className="h-14"><Link to="/orders">My Orders</Link></Button>
        </div>
      </section>
      {incomplete ? (
        <Card className="border-warn/30 bg-warn-soft">
          <p className="font-medium text-ink">Complete your profile to order</p>
          <p className="mt-1 text-sm text-muted">We need your mobile number and a delivery address before the first order.</p>
          <Button asChild className="mt-3" size="sm"><Link to="/profile">Update profile</Link></Button>
        </Card>
      ) : null}
      <section>
        <h2 className="mb-2 font-display text-lg font-semibold">Current delivery</h2>
        {current.isLoading ? <Skeleton className="h-40 rounded-3xl" /> : current.data ? (
          <Card className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold text-brand">{current.data.orderNumber}</p>
                <p className="text-sm text-muted">{formatDate(current.data.preferredDate)} · {slotHint(current.data.timeSlot)}</p>
              </div>
              <StatusBadge status={current.data.status} />
            </div>
            <DeliveryTimeline status={current.data.status} />
            <p className="text-sm text-ink">{current.data.items.map((i) => `${i.quantity} × ${i.productName}`).join(", ")}</p>
            {current.data.assignedAgent ? (
              <p className="flex items-center gap-2 text-sm text-muted"><Truck className="size-4 text-cyan" />{current.data.assignedAgent.name} · {current.data.assignedAgent.phone}</p>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link to="/orders/$orderId" params={{ orderId: String(current.data.id) }}>View details</Link>
            </Button>
          </Card>
        ) : (
          <Card className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">No active delivery</p>
              <p className="text-sm text-muted">Place an order and we will bring fresh water to you.</p>
            </div>
            <Droplets className="size-8 text-cyan" />
          </Card>
        )}
      </section>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Saved address</p>
        <div className="mt-3"><AddressBlock address={profile?.address} name={profile?.fullName} /></div>
      </Card>
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Popular sizes</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(products.data ?? []).map((p) => (
            <Link key={p.id} to="/order" className="rounded-3xl border border-line bg-paper p-3 shadow-card transition-transform duration-150 hover:-translate-y-0.5">
              <ProductArt artKey={p.artKey} className="h-24" />
              <p className="mt-2 text-sm font-semibold leading-tight">{p.name}</p>
              <p className="text-sm text-brand">{inr(p.unitPrice)}</p>
            </Link>
          ))}
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`tel:${settings?.phonePrimary ?? AGENCY.phones[0]}`} className="flex items-center gap-3 rounded-3xl border border-line bg-paper p-4 shadow-card">
          <span className="grid size-11 place-items-center rounded-2xl bg-foam text-brand"><Phone className="size-5" /></span>
          <span><span className="block text-sm font-semibold">Call the agency</span><span className="text-sm text-muted">{settings?.phonePrimary ?? AGENCY.phones[0]}</span></span>
        </a>
        <Link to="/contact" className="flex items-center gap-3 rounded-3xl border border-line bg-paper p-4 shadow-card">
          <span className="grid size-11 place-items-center rounded-2xl bg-foam text-brand"><HeartPulse className="size-5" /></span>
          <span><span className="block text-sm font-semibold">Help & support</span><span className="text-sm text-muted">Message Kalpataru</span></span>
        </Link>
      </div>
    </div>
  );
}

function MarketingHome() {
  const products = useProducts();
  const settings = usePublicSettings();
  const s = settings.data;
  return (
    <CustomerShell requireAuth={false}>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-float">
          <div className="navy-wash px-5 py-8 text-paper sm:px-8">
            <BrandLockup inverted />
            <h1 className="mt-6 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl">Pure water, delivered to your door.</h1>
            <p className="mt-3 max-w-md text-sm text-cyan-soft/90 sm:text-base">
              {s?.companyName ?? AGENCY.company}. Sealed SUPEYO jars and bottles for homes, shops, and offices across Nadia.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="cyan"><Link to="/register">Order water</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link to="/login">I already have an account</Link></Button>
            </div>
          </div>
          <img src="/brand/poster.webp" alt="SUPEYO packaged drinking water" className="h-56 w-full object-cover object-center sm:h-72" loading="eager" fetchPriority="high" style={{ height: "auto" }}/>
        </section>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[{ icon: Droplets, label: "100% Pure" }, { icon: ShieldCheck, label: "Safe & hygienic" }, { icon: Leaf, label: "Natural goodness" }, { icon: HeartPulse, label: "Better health" }].map((item) => (
            <li key={item.label} className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-3 text-sm font-medium">
              <item.icon className="size-4 text-cyan" />{item.label}
            </li>
          ))}
        </ul>
        <section>
          <h2 className="font-display text-xl font-semibold">How it works</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { n: "1", t: "Create your account", d: "Save your name, mobile, and delivery address." },
              { n: "2", t: "Place an order", d: "Pick jar size, quantity, and a delivery slot." },
              { n: "3", t: "Track & receive", d: "Follow the status until SUPEYO arrives at your door." },
            ].map((step) => (
              <li key={step.n} className="rounded-3xl border border-line bg-paper p-5">
                <span className="grid size-8 place-items-center rounded-full bg-foam font-display text-sm font-semibold text-brand">{step.n}</span>
                <p className="mt-3 font-semibold">{step.t}</p>
                <p className="mt-1 text-sm text-muted">{step.d}</p>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Our water</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(products.data ?? []).map((p) => (
              <div key={p.id} className="rounded-3xl border border-line bg-paper p-3">
                <ProductArt artKey={p.artKey} className="h-24" />
                <p className="mt-2 text-sm font-semibold">{p.name}</p>
                <p className="text-sm text-brand">{inr(p.unitPrice)}</p>
              </div>
            ))}
          </div>
        </section>
        <Card className="space-y-2">
          <p className="font-display font-semibold">{s?.companyName ?? AGENCY.company}</p>
          <p className="text-sm text-muted">Proprietor {s?.proprietor ?? AGENCY.proprietor}</p>
          <p className="text-sm text-muted">{s?.addressLine ?? AGENCY.address}</p>
          <p className="text-sm">
            <a className="text-brand" href={`tel:${s?.phonePrimary ?? AGENCY.phones[0]}`}>{s?.phonePrimary ?? AGENCY.phones[0]}</a>
            {s?.phoneSecondary ? <>{" · "}<a className="text-brand" href={`tel:${s.phoneSecondary}`}>{s.phoneSecondary}</a></> : null}
          </p>
          <p className="text-xs text-muted">FSSAI {s?.fssai ?? AGENCY.fssai}</p>
        </Card>
      </div>
    </CustomerShell>
  );
}

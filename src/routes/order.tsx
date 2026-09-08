import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ProductArt } from "@/components/brand/product-art";
import { CustomerShell } from "@/components/layout/customer-shell";
import { AddressBlock } from "@/components/order/address-block";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/input";
import { TIME_SLOTS } from "@/lib/agency";
import { useMe, usePaymentMethods, useProducts } from "@/lib/queries";
import { placeOrder } from "@/lib/server/orders";
import { addDaysISO, cn, inr, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/order")({ component: OrderPage });

function OrderPage() {
  return <CustomerShell><OrderForm /></CustomerShell>;
}

function OrderForm() {
  const navigate = useNavigate();
  const products = useProducts();
  const payments = usePaymentMethods();
  const me = useMe();
  const [qty, setQty] = useState<Record<number, number>>({});
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState<(typeof TIME_SLOTS)[number]["id"]>("morning");
  const [pay, setPay] = useState("cod");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const enabledPay = payments.data ?? [];
  const payId = enabledPay.some((p) => p.id === pay) ? pay : enabledPay[0]?.id ?? "cod";
  const lines = useMemo(() => (products.data ?? []).map((p) => ({ product: p, quantity: qty[p.id] ?? 0 })).filter((l) => l.quantity > 0), [products.data, qty]);
  const total = lines.reduce((s, l) => s + l.product.unitPrice * l.quantity, 0);
  const profile = me.data?.profile;
  const ready = Boolean(profile?.fullName && profile.mobile && profile.address);

  async function submit() {
    if (!ready) { toast.error("Please save your name, mobile, and address first."); return; }
    if (lines.length === 0) { toast.error("Select a product and quantity."); return; }
    setBusy(true);
    try {
      const order = await placeOrder({
        data: {
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
          preferredDate: date, timeSlot: slot, note, paymentMethod: payId,
        },
      });
      toast.success(`Order ${order.orderNumber} placed`);
      void navigate({ to: "/orders/$orderId", params: { orderId: String(order.id) } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Order water</h1>
        <p className="mt-1 text-sm text-muted">Pick a size, choose a slot, and we will deliver.</p>
      </div>
      {!ready && profile ? (
        <Card className="border-warn/30 bg-warn-soft">
          <p className="font-medium">Your profile is incomplete</p>
          <p className="text-sm text-muted">Add your mobile number and delivery address to continue.</p>
          <Button asChild size="sm" className="mt-3"><Link to="/profile">Complete profile</Link></Button>
        </Card>
      ) : null}
      <section className="space-y-3">
        {(products.data ?? []).map((p) => {
          const q = qty[p.id] ?? 0;
          return (
            <Card key={p.id} className="grid grid-cols-[88px_1fr] gap-3 p-3 sm:grid-cols-[104px_1fr]">
              <ProductArt artKey={p.artKey} className="h-24 sm:h-28" />
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="font-semibold leading-tight">{p.name}</p>
                  <p className="text-xs text-muted">{p.sizeLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-brand">{inr(p.unitPrice)}</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" className="grid size-10 place-items-center rounded-xl border border-line bg-ice text-ink" onClick={() => setQty((s) => ({ ...s, [p.id]: Math.max(0, (s[p.id] ?? 0) - 1) }))} aria-label={`Decrease ${p.name}`}><Minus className="size-4" /></button>
                  <span className="w-8 text-center font-semibold tabular-nums">{q}</span>
                  <button type="button" className="grid size-10 place-items-center rounded-xl bg-brand text-paper" onClick={() => setQty((s) => ({ ...s, [p.id]: Math.min(50, (s[p.id] ?? 0) + 1) }))} aria-label={`Increase ${p.name}`}><Plus className="size-4" /></button>
                  {q > 0 ? <span className="ml-auto text-sm font-medium tabular-nums">{inr(p.unitPrice * q)}</span> : null}
                </div>
              </div>
            </Card>
          );
        })}
      </section>
      <Card className="space-y-4">
        <Field label="Preferred delivery date">
          <input type="date" className="h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-sm outline-none focus:border-brand-mid focus:ring-2 focus:ring-cyan/30" min={todayISO()} max={addDaysISO(14)} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium">Time slot</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TIME_SLOTS.map((t) => (
              <button key={t.id} type="button" onClick={() => setSlot(t.id)} className={cn("rounded-2xl border px-3 py-3 text-left transition-colors", slot === t.id ? "border-brand bg-foam" : "border-line bg-paper")}>
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="text-xs text-muted">{t.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Payment</p>
          <div className="space-y-2">
            {enabledPay.map((m) => (
              <button key={m.id} type="button" onClick={() => setPay(m.id)} className={cn("flex w-full flex-col rounded-2xl border px-3 py-3 text-left", payId === m.id ? "border-brand bg-foam" : "border-line")}>
                <span className="text-sm font-semibold">{m.label}</span>
                <span className="text-xs text-muted">{m.description}</span>
              </button>
            ))}
          </div>
        </div>
        <Field label="Note for delivery (optional)">
          <Textarea maxLength={400} placeholder="Gate code, extra jars, preferred landmark…" value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Deliver to</p>
        <div className="mt-3"><AddressBlock address={profile?.address} name={profile?.fullName} /></div>
      </Card>
      <div className="sticky bottom-20 z-20 rounded-3xl border border-line bg-paper/95 p-4 shadow-float backdrop-blur md:bottom-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="font-display text-xl font-semibold tabular-nums">{inr(total)}</p>
          </div>
          <Button size="lg" disabled={busy || total <= 0} onClick={submit}>{busy ? "Placing…" : "Place order"}</Button>
        </div>
      </div>
    </div>
  );
}

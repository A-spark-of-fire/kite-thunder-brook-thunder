import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as TIME_SLOTS } from "./agency-dJTRPtCM.mjs";
import { c as todayISO, n as cn, o as inr, t as addDaysISO } from "./utils-sqhcPpa2.mjs";
import { o as placeOrder } from "./orders-BTden6zy.mjs";
import { p as Minus, u as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DyWRsNxk.mjs";
import { a as usePaymentMethods, n as useMe, o as useProducts } from "./queries-CqZwC5NC.mjs";
import { t as AddressBlock } from "./address-block-37kaDHCN.mjs";
import { t as Card } from "./card-CsmvjG3B.mjs";
import { r as Textarea, t as Field } from "./input-Cbf0m3GD.mjs";
import { t as CustomerShell } from "./customer-shell-Bq946h6q.mjs";
import { t as ProductArt } from "./product-art-DhnEG-Rs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-knRPL1vX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderForm, {}) });
}
function OrderForm() {
	const navigate = useNavigate();
	const products = useProducts();
	const payments = usePaymentMethods();
	const me = useMe();
	const [qty, setQty] = (0, import_react.useState)({});
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [slot, setSlot] = (0, import_react.useState)("morning");
	const [pay, setPay] = (0, import_react.useState)("cod");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const enabledPay = payments.data ?? [];
	const payId = enabledPay.some((p) => p.id === pay) ? pay : enabledPay[0]?.id ?? "cod";
	const lines = (0, import_react.useMemo)(() => (products.data ?? []).map((p) => ({
		product: p,
		quantity: qty[p.id] ?? 0
	})).filter((l) => l.quantity > 0), [products.data, qty]);
	const total = lines.reduce((s, l) => s + l.product.unitPrice * l.quantity, 0);
	const profile = me.data?.profile;
	const ready = Boolean(profile?.fullName && profile.mobile && profile.address);
	async function submit() {
		if (!ready) {
			toast.error("Please save your name, mobile, and address first.");
			return;
		}
		if (lines.length === 0) {
			toast.error("Select a product and quantity.");
			return;
		}
		setBusy(true);
		try {
			const order = await placeOrder({ data: {
				items: lines.map((l) => ({
					productId: l.product.id,
					quantity: l.quantity
				})),
				preferredDate: date,
				timeSlot: slot,
				note,
				paymentMethod: payId
			} });
			toast.success(`Order ${order.orderNumber} placed`);
			navigate({
				to: "/orders/$orderId",
				params: { orderId: String(order.id) }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not place order");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Order water"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Pick a size, choose a slot, and we will deliver."
			})] }),
			!ready && profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-warn/30 bg-warn-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Your profile is incomplete"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Add your mobile number and delivery address to continue."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							children: "Complete profile"
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "space-y-3",
				children: (products.data ?? []).map((p) => {
					const q = qty[p.id] ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "grid grid-cols-[88px_1fr] gap-3 p-3 sm:grid-cols-[104px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductArt, {
							artKey: p.artKey,
							className: "h-24 sm:h-28"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold leading-tight",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: p.sizeLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-semibold text-brand",
									children: inr(p.unitPrice)
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-10 place-items-center rounded-xl border border-line bg-ice text-ink",
										onClick: () => setQty((s) => ({
											...s,
											[p.id]: Math.max(0, (s[p.id] ?? 0) - 1)
										})),
										"aria-label": `Decrease ${p.name}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 text-center font-semibold tabular-nums",
										children: q
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-10 place-items-center rounded-xl bg-brand text-paper",
										onClick: () => setQty((s) => ({
											...s,
											[p.id]: Math.min(50, (s[p.id] ?? 0) + 1)
										})),
										"aria-label": `Increase ${p.name}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
									}),
									q > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-sm font-medium tabular-nums",
										children: inr(p.unitPrice * q)
									}) : null
								]
							})]
						})]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Preferred delivery date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-sm outline-none focus:border-brand-mid focus:ring-2 focus:ring-cyan/30",
							min: todayISO(),
							max: addDaysISO(14),
							value: date,
							onChange: (e) => setDate(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm font-medium",
						children: "Time slot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-3",
						children: TIME_SLOTS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSlot(t.id),
							className: cn("rounded-2xl border px-3 py-3 text-left transition-colors", slot === t.id ? "border-brand bg-foam" : "border-line bg-paper"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold",
								children: t.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: t.hint
							})]
						}, t.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm font-medium",
						children: "Payment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: enabledPay.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPay(m.id),
							className: cn("flex w-full flex-col rounded-2xl border px-3 py-3 text-left", payId === m.id ? "border-brand bg-foam" : "border-line"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: m.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: m.description
							})]
						}, m.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Note for delivery (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							maxLength: 400,
							placeholder: "Gate code, extra jars, preferred landmark…",
							value: note,
							onChange: (e) => setNote(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted",
				children: "Deliver to"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, {
					address: profile?.address,
					name: profile?.fullName
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-20 z-20 rounded-3xl border border-line bg-paper/95 p-4 shadow-float backdrop-blur md:bottom-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold tabular-nums",
						children: inr(total)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						disabled: busy || total <= 0,
						onClick: submit,
						children: busy ? "Placing…" : "Place order"
					})]
				})
			})
		]
	});
}
//#endregion
export { OrderPage as component };

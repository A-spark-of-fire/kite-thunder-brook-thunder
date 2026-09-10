import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient } from "./_libs/react+tanstack__react-query.mjs";
import { c as slotHint, n as CANCELABLE_STATUSES } from "./_ssr/agency-dJTRPtCM.mjs";
import { a as formatDateTime, i as formatDate, s as inr } from "./_ssr/map-CpHYkenY.mjs";
import { t as cancelMyOrder } from "./_ssr/orders-DE-DidE_.mjs";
import { d as Phone, i as Truck } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$3 } from "./_ssr/router-B0HgtoCy.mjs";
import { t as Button } from "./_ssr/button-WqCaHdvQ.mjs";
import { t as PageSkeleton } from "./_ssr/skeleton-BU4DGjVB.mjs";
import { n as useMe, r as useMyOrder } from "./_ssr/queries-Y89j3blD.mjs";
import { t as AddressBlock } from "./_ssr/address-block-37kaDHCN.mjs";
import { t as Card } from "./_ssr/card-BNpU_TZN.mjs";
import { t as StatusBadge } from "./_ssr/status-badge-BUKINHfK.mjs";
import { t as DeliveryTimeline } from "./_ssr/timeline-bdgHRpua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_orderId-Bbob0GlX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderDetailPage() {
	const { orderId } = Route$3.useParams();
	const id = Number(orderId);
	const q = useMyOrder(id, Number.isFinite(id));
	const me = useMe();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!Number.isFinite(id)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Invalid order."
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {});
	if (q.error || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-medium",
		children: "We could not find that order."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		className: "mt-3",
		variant: "secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/orders",
			children: "Back to my orders"
		})
	})] });
	const o = q.data;
	const canCancel = CANCELABLE_STATUSES.includes(o.status);
	async function onCancel() {
		if (!confirm("Cancel this order? You can place a new one any time.")) return;
		setBusy(true);
		try {
			await cancelMyOrder({ data: {
				id,
				reason: "Cancelled by customer"
			} });
			toast.success("Order cancelled");
			await qc.invalidateQueries({ queryKey: ["my-order", id] });
			await qc.invalidateQueries({ queryKey: ["my-orders"] });
			await qc.invalidateQueries({ queryKey: ["current-delivery"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not cancel");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-brand",
				onClick: () => navigate({ to: "/orders" }),
				children: "← My orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-semibold text-brand",
						children: o.orderNumber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: "Delivery details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["Placed ", formatDateTime(o.createdAt)]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryTimeline, { status: o.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Expected ",
						formatDate(o.expectedDate ?? o.preferredDate),
						" · ",
						slotHint(o.timeSlot)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted",
						children: "Items"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: o.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: item.productName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted",
								children: [
									item.sizeLabel,
									" · ",
									item.quantity,
									" × ",
									inr(item.unitPrice)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums",
								children: inr(item.lineTotal)
							})]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between pt-1 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: inr(o.total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"Payment: ",
							o.paymentMethod.toUpperCase(),
							" · ",
							o.paymentStatus
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted",
				children: "Deliver to"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, {
				address: o.address,
				name: me.data?.profile.fullName
			})] }),
			o.assignedAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-2xl bg-foam text-brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: o.assignedAgent.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Delivery partner"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `tel:${o.assignedAgent.phone}`,
					className: "grid size-11 place-items-center rounded-xl bg-brand text-paper",
					"aria-label": "Call delivery partner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
				})]
			}) : null,
			o.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted",
				children: "Your note"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: o.note
			})] }) : null,
			canCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "danger",
				className: "w-full",
				disabled: busy,
				onClick: onCancel,
				children: busy ? "Cancelling…" : "Cancel order"
			}) : null
		]
	});
}
//#endregion
export { OrderDetailPage as component };

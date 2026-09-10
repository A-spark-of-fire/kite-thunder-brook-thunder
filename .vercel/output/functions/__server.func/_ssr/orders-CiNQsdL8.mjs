import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as slotLabel } from "./agency-dJTRPtCM.mjs";
import { i as formatDate, s as inr } from "./map-CpHYkenY.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { n as Skeleton } from "./skeleton-BU4DGjVB.mjs";
import { i as useMyOrders } from "./queries-Y89j3blD.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { t as StatusBadge } from "./status-badge-BUKINHfK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CiNQsdL8.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersList() {
	const q = useMyOrders();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "My orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Only you can see these deliveries."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/order",
					children: "New order"
				})
			})]
		}), q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-3xl" })]
		}) : (q.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "py-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No orders yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Your first SUPEYO delivery is a tap away."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/order",
						children: "Order water"
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: q.data.map((o) => {
				const qty = o.items.reduce((s, i) => s + i.quantity, 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display font-semibold text-brand",
								children: o.orderNumber
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: formatDate(o.createdAt)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink",
							children: o.items.map((i) => i.productName).join(", ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-3 gap-2 text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold text-ink tabular-nums",
									children: qty
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold text-ink tabular-nums",
									children: inr(o.total)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-semibold text-ink",
									children: [formatDate(o.preferredDate), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-normal text-muted",
										children: slotLabel(o.timeSlot)
									})]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/orders/$orderId",
								params: { orderId: String(o.id) },
								children: "View details"
							})
						})
					]
				}) }, o.id);
			})
		})]
	});
}
//#endregion
export { OrdersList as component };

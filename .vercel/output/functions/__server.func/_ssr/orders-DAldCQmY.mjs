import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as STATUS_META, r as ORDER_STATUSES } from "./agency-dJTRPtCM.mjs";
import { n as cn, o as inr, r as formatDate } from "./utils-sqhcPpa2.mjs";
import { n as Skeleton } from "./skeleton-Cz8ZXMNQ.mjs";
import { t as Card } from "./card-CsmvjG3B.mjs";
import { t as StatusBadge } from "./status-badge-g_qyIrGI.mjs";
import { o as adminListOrders } from "./admin-ncbwCwg6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DAldCQmY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrdersPage() {
	const [status, setStatus] = (0, import_react.useState)("all");
	const q = useQuery({
		queryKey: ["admin-orders", status],
		queryFn: () => adminListOrders({ data: { status } })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-auto pb-1",
				children: ["all", ...ORDER_STATUSES].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStatus(s),
					className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", status === s ? "bg-navy text-paper" : "bg-paper text-muted border border-line"),
					children: s === "all" ? "All" : STATUS_META[s].short
				}, s))
			}),
			q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-3xl" }) : (q.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No orders in this view."
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: q.data.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/orders/$orderId",
					params: { orderId: String(o.id) },
					className: "block rounded-3xl border border-line bg-paper p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-brand",
								children: o.orderNumber
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink",
								children: o.customerName || "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									formatDate(o.preferredDate),
									" · ",
									inr(o.total),
									" · ",
									o.items.map((i) => `${i.quantity}× ${i.productName}`).join(", ")
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
					})
				}) }, o.id))
			})
		]
	});
}
//#endregion
export { AdminOrdersPage as component };

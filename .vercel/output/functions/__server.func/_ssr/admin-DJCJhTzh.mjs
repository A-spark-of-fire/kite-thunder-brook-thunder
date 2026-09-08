import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { o as inr, r as formatDate } from "./utils-sqhcPpa2.mjs";
import { f as Package, i as Truck, n as Users, s as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as Skeleton } from "./skeleton-Cz8ZXMNQ.mjs";
import { t as Card } from "./card-CsmvjG3B.mjs";
import { t as StatusBadge } from "./status-badge-g_qyIrGI.mjs";
import { m as getAdminStats, o as adminListOrders } from "./admin-ncbwCwg6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DJCJhTzh.js
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const stats = useQuery({
		queryKey: ["admin-stats"],
		queryFn: () => getAdminStats()
	});
	const incoming = useQuery({
		queryKey: ["admin-orders", "incoming"],
		queryFn: () => adminListOrders({ data: { status: "placed" } })
	});
	const s = stats.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Agency desk"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Incoming orders, deliveries, and catalogue."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					{
						label: "Incoming",
						value: s?.incoming,
						icon: ShoppingBag
					},
					{
						label: "On the road",
						value: s?.outForDelivery,
						icon: Truck
					},
					{
						label: "Delivered today",
						value: s?.deliveredToday,
						icon: Package
					},
					{
						label: "Customers",
						value: s?.customers,
						icon: Users
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 text-cyan" }),
						stats.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-10" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl font-semibold tabular-nums",
							children: item.value ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: item.label
						})
					]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "New orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/orders",
					className: "text-sm text-brand",
					children: "View all"
				})]
			}),
			incoming.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-3xl" }) : (incoming.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No newly placed orders."
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: incoming.data.slice(0, 8).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/orders/$orderId",
					params: { orderId: String(o.id) },
					className: "flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold text-brand",
						children: o.orderNumber
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted",
						children: [
							o.customerName,
							" · ",
							formatDate(o.preferredDate),
							" · ",
							inr(o.total)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
				}) }, o.id))
			})
		]
	});
}
//#endregion
export { AdminHome as component };

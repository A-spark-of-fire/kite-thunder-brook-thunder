import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatDate } from "./map-CpHYkenY.mjs";
import { n as Skeleton } from "./skeleton-BU4DGjVB.mjs";
import { t as AddressBlock } from "./address-block-37kaDHCN.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { i as adminListCustomers } from "./admin-C7gXAG3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-BbnqAiqf.js
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomersPage() {
	const q = useQuery({
		queryKey: ["admin-customers"],
		queryFn: () => adminListCustomers()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: "Customers"
		}), q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-3xl" }) : (q.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No customer accounts yet."
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: q.data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: c.fullName || "Unnamed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: c.mobile || "No mobile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: c.email
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-foam px-2 py-0.5 text-xs font-semibold text-brand",
							children: [c.orderCount, " orders"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, { address: c.address }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted",
						children: ["Joined ", formatDate(c.createdAt)]
					})
				]
			}) }, c.userId))
		})]
	});
}
//#endregion
export { AdminCustomersPage as component };

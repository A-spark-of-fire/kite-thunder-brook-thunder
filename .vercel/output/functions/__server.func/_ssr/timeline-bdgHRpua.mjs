import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as STATUS_META, o as TIMELINE_STEPS } from "./agency-dJTRPtCM.mjs";
import { r as cn } from "./map-CpHYkenY.mjs";
import { C as Check, S as Circle, i as Truck, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timeline-bdgHRpua.js
var import_jsx_runtime = require_jsx_runtime();
function DeliveryTimeline({ status }) {
	if (status === "cancelled") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 shrink-0" }), " This order was cancelled."]
	});
	const current = TIMELINE_STEPS.indexOf(status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid grid-cols-5 gap-1",
		children: TIMELINE_STEPS.map((step, i) => {
			const done = current >= i;
			const Icon = step === "out_for_delivery" ? Truck : done ? Check : Circle;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col items-center gap-1.5 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("grid size-8 place-items-center rounded-full border", done ? "border-brand bg-brand text-paper" : "border-line bg-paper text-muted", current === i && "ring-2 ring-cyan/50"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[10px] font-medium leading-tight", done ? "text-navy" : "text-muted"),
					children: STATUS_META[step].short
				})]
			}, step);
		})
	});
}
//#endregion
export { DeliveryTimeline as t };

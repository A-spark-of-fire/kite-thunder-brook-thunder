import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as cn } from "./map-CpHYkenY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-DRl6J15Q.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors duration-150 focus:border-brand-mid focus:ring-2 focus:ring-cyan/30 disabled:opacity-60", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors duration-150 focus:border-brand-mid focus:ring-2 focus:ring-cyan/30", className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-ink",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { Input as n, Textarea as r, Field as t };

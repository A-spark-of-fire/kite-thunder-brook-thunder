import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as cn } from "./map-CpHYkenY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-B5LF_Sqk.js
var import_jsx_runtime = require_jsx_runtime();
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex overflow-hidden rounded-2xl bg-foam", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/brand/logo.jpg",
			alt: "SUPEYO",
			className: "size-full object-cover"
		})
	});
}
function BrandLockup({ inverted = false, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { className: compact ? "size-10 rounded-xl" : "size-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block font-display font-semibold tracking-tight", compact ? "text-base" : "text-lg", inverted ? "text-paper" : "text-navy"),
				children: "SUPEYO"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block text-[10px] font-medium uppercase tracking-[0.16em]", inverted ? "text-cyan-soft" : "text-muted"),
				children: "Packaged Drinking Water"
			})]
		})]
	});
}
//#endregion
export { BrandLockup as t };

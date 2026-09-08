import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./utils-sqhcPpa2.mjs";
import { x as Droplets } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-art-DhnEG-Rs.js
var import_jsx_runtime = require_jsx_runtime();
function ProductArt({ artKey, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative grid place-items-center overflow-hidden rounded-2xl bg-linear-to-b from-foam to-cyan-soft", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 80 96",
			className: "h-[78%] w-auto text-brand",
			"aria-hidden": true,
			children: artKey === "pack1" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pack, {}) : artKey === "bottle5" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bottle, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jar, { tall: artKey === "jar20" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "absolute right-2 top-2 size-4 text-cyan" })]
	});
}
function Jar({ tall }) {
	const y = tall ? 8 : 16;
	const h = tall ? 72 : 60;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.2",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: y - 6,
				width: "24",
				height: "8",
				rx: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: `M22 ${y} h36 l4 8 v${h - 16} a12 12 0 0 1 -12 12 h-20 a12 12 0 0 1 -12 -12 v-${h - 16} z` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `M26 ${y + 18} h28`,
				opacity: "0.45"
			})
		]
	});
}
function Bottle() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.2",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "34",
			y: "6",
			width: "12",
			height: "10",
			rx: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M30 16 h20 l4 10 v52 a10 10 0 0 1 -10 10 h-8 a10 10 0 0 1 -10 -10 v-52 z" })]
	});
}
function Pack() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10",
				y: "28",
				width: "18",
				height: "48",
				rx: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "31",
				y: "22",
				width: "18",
				height: "54",
				rx: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "52",
				y: "28",
				width: "18",
				height: "48",
				rx: "5"
			})
		]
	});
}
//#endregion
export { ProductArt as t };

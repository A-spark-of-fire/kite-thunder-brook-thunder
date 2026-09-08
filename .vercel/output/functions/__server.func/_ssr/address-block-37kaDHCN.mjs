import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { m as MapPin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/address-block-37kaDHCN.js
var import_jsx_runtime = require_jsx_runtime();
function AddressBlock({ address, name }) {
	if (!address?.line1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No delivery address saved yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-ink",
					children: name
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-ink",
					children: [address.line1, address.line2 ? `, ${address.line2}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: [
						address.city,
						", ",
						address.state,
						" ",
						address.pincode
					]
				}),
				address.landmark ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: ["Landmark: ", address.landmark]
				}) : null
			]
		})]
	});
}
//#endregion
export { AddressBlock as t };

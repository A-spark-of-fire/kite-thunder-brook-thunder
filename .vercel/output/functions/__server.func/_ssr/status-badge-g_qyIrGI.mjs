import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as STATUS_META } from "./agency-dJTRPtCM.mjs";
import { n as cn } from "./utils-sqhcPpa2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-g_qyIrGI.js
var import_jsx_runtime = require_jsx_runtime();
var tones = {
	blue: "bg-foam text-brand border-line",
	cyan: "bg-cyan-soft text-navy border-cyan/30",
	amber: "bg-warn-soft text-warn border-warn/20",
	navy: "bg-navy text-paper border-navy",
	green: "bg-ok-soft text-ok border-ok/20",
	red: "bg-danger-soft text-danger border-danger/20",
	mute: "bg-ice text-muted border-line"
};
function Badge({ tone = "blue", className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide", tones[tone], className),
		...props
	});
}
function StatusBadge({ status }) {
	const meta = STATUS_META[status] ?? {
		label: status,
		short: status,
		tone: "mute"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: meta.tone,
		children: meta.label
	});
}
//#endregion
export { StatusBadge as t };

import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-sqhcPpa2.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function money(value) {
	if (value == null || value === "") return 0;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function inr(value) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 2
	}).format(money(value));
}
function formatDate(value) {
	if (!value) return "—";
	const d = new Date(value.includes("T") ? value : `${value}T00:00:00`);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function formatDateTime(value) {
	if (!value) return "—";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function addDaysISO(days) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + days);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function indianMobile(value) {
	return /^[6-9]\d{9}$/.test(value.replace(/\s+/g, ""));
}
//#endregion
export { indianMobile as a, todayISO as c, formatDateTime as i, cn as n, inr as o, formatDate as r, money as s, addDaysISO as t };

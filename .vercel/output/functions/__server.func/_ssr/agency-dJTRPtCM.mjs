//#region node_modules/.nitro/vite/services/ssr/assets/agency-dJTRPtCM.js
var AGENCY = {
	brand: "SUPEYO",
	tagline: "Packaged Drinking Water",
	company: "Kalpataru Soft Drinks and Enterprise",
	proprietor: "Ananda Hazra",
	phones: ["8617297495", "8967648044"],
	email: "kalpatarusoftDrinksenterprise@gmail.com",
	address: "Kalinarayanpur, P.O. Kalinarayapure, P.S. Taherpur, Dist. Nadia, PIN 741254, West Bengal",
	fssai: "12826012000290",
	promise: "Pure Water for a Healthier You"
};
var TIME_SLOTS = [
	{
		id: "morning",
		label: "Morning",
		hint: "8:00 AM – 12:00 PM"
	},
	{
		id: "afternoon",
		label: "Afternoon",
		hint: "12:00 PM – 4:00 PM"
	},
	{
		id: "evening",
		label: "Evening",
		hint: "4:00 PM – 8:00 PM"
	}
];
var ORDER_STATUSES = [
	"placed",
	"confirmed",
	"preparing",
	"out_for_delivery",
	"delivered",
	"cancelled"
];
var CANCELABLE_STATUSES = ["placed", "confirmed"];
var STATUS_META = {
	placed: {
		label: "Order Placed",
		short: "Placed",
		tone: "blue"
	},
	confirmed: {
		label: "Order Confirmed",
		short: "Confirmed",
		tone: "cyan"
	},
	preparing: {
		label: "Preparing",
		short: "Preparing",
		tone: "amber"
	},
	out_for_delivery: {
		label: "Out for Delivery",
		short: "On the way",
		tone: "navy"
	},
	delivered: {
		label: "Delivered",
		short: "Delivered",
		tone: "green"
	},
	cancelled: {
		label: "Cancelled",
		short: "Cancelled",
		tone: "red"
	}
};
var TIMELINE_STEPS = [
	"placed",
	"confirmed",
	"preparing",
	"out_for_delivery",
	"delivered"
];
var STATUS_NOTIFY = {
	confirmed: (n) => ({
		title: `Order ${n} confirmed`,
		body: `Your order ${n} has been confirmed.`
	}),
	preparing: (n) => ({
		title: `Order ${n} is being prepared`,
		body: `Your order ${n} is being prepared for dispatch.`
	}),
	out_for_delivery: (n) => ({
		title: `Order ${n} is out for delivery`,
		body: `Your order ${n} is out for delivery.`
	}),
	delivered: (n) => ({
		title: `Order ${n} delivered`,
		body: `Your order ${n} has been delivered. Stay hydrated.`
	}),
	cancelled: (n) => ({
		title: `Order ${n} cancelled`,
		body: `Your order ${n} has been cancelled.`
	})
};
function slotLabel(id) {
	return TIME_SLOTS.find((s) => s.id === id)?.label ?? id;
}
function slotHint(id) {
	const s = TIME_SLOTS.find((t) => t.id === id);
	return s ? `${s.label} · ${s.hint}` : id;
}
//#endregion
export { STATUS_NOTIFY as a, slotHint as c, STATUS_META as i, slotLabel as l, CANCELABLE_STATUSES as n, TIMELINE_STEPS as o, ORDER_STATUSES as r, TIME_SLOTS as s, AGENCY as t };

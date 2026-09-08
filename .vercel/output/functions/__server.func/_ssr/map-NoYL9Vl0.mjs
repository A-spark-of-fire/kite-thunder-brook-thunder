import { s as money } from "./utils-sqhcPpa2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-NoYL9Vl0.js
function asObj(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {
		return {};
	}
	return {};
}
function asArr(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		if (Array.isArray(parsed)) return parsed;
	} catch {
		return [];
	}
	return [];
}
function str(value, fallback = "") {
	return value == null ? fallback : String(value);
}
function num(value) {
	return money(value);
}
function bool(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function mapAddress(row) {
	return {
		id: num(row.id),
		userId: str(row.user_id),
		label: str(row.label, "Home"),
		line1: str(row.line1),
		line2: str(row.line2),
		city: str(row.city),
		state: str(row.state, "West Bengal"),
		pincode: str(row.pincode),
		landmark: str(row.landmark),
		isDefault: bool(row.is_default)
	};
}
function mapAddressSnapshot(raw) {
	const o = asObj(raw);
	return {
		label: str(o.label, "Home"),
		line1: str(o.line1),
		line2: str(o.line2),
		city: str(o.city),
		state: str(o.state, "West Bengal"),
		pincode: str(o.pincode),
		landmark: str(o.landmark)
	};
}
function mapProduct(row) {
	return {
		id: num(row.id),
		name: str(row.name),
		sizeLabel: str(row.size_label),
		sizeMl: num(row.size_ml),
		unitPrice: num(row.unit_price),
		description: str(row.description),
		artKey: str(row.art_key, "jar20"),
		isActive: bool(row.is_active),
		sortOrder: num(row.sort_order)
	};
}
function mapPayment(row) {
	return {
		id: str(row.id),
		label: str(row.label),
		description: str(row.description),
		enabled: bool(row.enabled),
		sortOrder: num(row.sort_order)
	};
}
function mapSettings(row) {
	const r = row ?? {};
	return {
		brandName: str(r.brand_name, "SUPEYO"),
		companyName: str(r.company_name, "Kalpataru Soft Drinks and Enterprise"),
		proprietor: str(r.proprietor, "Ananda Hazra"),
		phonePrimary: str(r.phone_primary, "8617297495"),
		phoneSecondary: str(r.phone_secondary, "8967648044"),
		email: str(r.email, "kalpatarusoftDrinksenterprise@gmail.com"),
		addressLine: str(r.address_line, "Kalinarayanpur, P.O. Kalinarayapure, P.S. Taherpur, Dist. Nadia, PIN 741254, West Bengal"),
		fssai: str(r.fssai, "12826012000290"),
		upiId: str(r.upi_id)
	};
}
function mapAgent(row) {
	return {
		id: num(row.id),
		name: str(row.name),
		phone: str(row.phone),
		isActive: bool(row.is_active)
	};
}
function mapItem(row) {
	return {
		id: num(row.id),
		productId: row.product_id == null ? null : num(row.product_id),
		productName: str(row.product_name),
		sizeLabel: str(row.size_label),
		unitPrice: num(row.unit_price),
		quantity: num(row.quantity),
		lineTotal: num(row.line_total)
	};
}
function mapHistory(row) {
	return {
		id: num(row.id),
		status: str(row.status, "placed"),
		note: str(row.note),
		createdAt: str(row.created_at)
	};
}
function mapNotification(row) {
	return {
		id: num(row.id),
		title: str(row.title),
		body: str(row.body),
		orderId: row.order_id == null ? null : num(row.order_id),
		isRead: bool(row.is_read),
		createdAt: str(row.created_at)
	};
}
function mapOrder(row, extras) {
	const agentId = row.agent_id ?? row.assigned_agent_id;
	const assignedAgent = agentId != null && str(row.agent_name || row.assigned_name) ? {
		id: num(agentId),
		name: str(row.agent_name || row.assigned_name),
		phone: str(row.agent_phone || row.assigned_phone)
	} : null;
	return {
		id: num(row.id),
		orderNumber: str(row.order_number),
		userId: str(row.user_id),
		status: str(row.status, "placed"),
		address: mapAddressSnapshot(row.address_snapshot),
		preferredDate: str(row.preferred_date),
		timeSlot: str(row.time_slot),
		note: str(row.note),
		paymentMethod: str(row.payment_method, "cod"),
		paymentStatus: str(row.payment_status, "pending"),
		subtotal: num(row.subtotal),
		total: num(row.total),
		assignedAgent,
		expectedDate: row.expected_date ? str(row.expected_date) : null,
		deliveredAt: row.delivered_at ? str(row.delivered_at) : null,
		cancelledAt: row.cancelled_at ? str(row.cancelled_at) : null,
		cancelReason: str(row.cancel_reason),
		createdAt: str(row.created_at),
		items: extras?.items ?? asArr(row.items).map(mapItem),
		history: extras?.history ?? asArr(row.history).map(mapHistory),
		customerName: row.customer_name ? str(row.customer_name) : void 0,
		customerMobile: row.customer_mobile ? str(row.customer_mobile) : void 0
	};
}
function mapProfile(row, opts) {
	return {
		userId: str(row.user_id),
		role: str(row.role, "customer") || "customer",
		fullName: str(row.full_name),
		mobile: str(row.mobile),
		altMobile: str(row.alt_mobile),
		email: row.email ? str(row.email) : null,
		image: row.image ? str(row.image) : null,
		canAccessAdmin: opts.canAccessAdmin,
		adminExists: opts.adminExists,
		address: opts.address
	};
}
//#endregion
export { mapItem as a, mapPayment as c, mapSettings as d, num as f, mapHistory as i, mapProduct as l, mapAddress as n, mapNotification as o, mapAgent as r, mapOrder as s, asArr as t, mapProfile as u };

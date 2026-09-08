import { r as createServerFn } from "./ssr.mjs";
import { a as STATUS_NOTIFY } from "./agency-dJTRPtCM.mjs";
import { r as getSql } from "./db-B45d6uD3.mjs";
import { t as authMiddleware } from "./middleware--6meZ4AD.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { cn as _enum, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BTden6zy.js
var placeSchema = object({
	items: array(object({
		productId: number().int().positive(),
		quantity: number().int().min(1).max(50)
	})).min(1),
	preferredDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	timeSlot: _enum([
		"morning",
		"afternoon",
		"evening"
	]),
	note: string().trim().max(400).optional().default(""),
	paymentMethod: string().min(1).max(20)
});
async function notifyCustomer(userId, orderId, orderNumber, status) {
	const msg = STATUS_NOTIFY[status]?.(orderNumber);
	if (!msg) return;
	await (await getSql())`insert into notifications (user_id, title, body, order_id) values (${userId}, ${msg.title}, ${msg.body}, ${orderId})`;
}
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d2d387e734d2b9ad38ff263d4ea22b591a11097849ddb7e854b3d1896e2dcb7e"));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ id: number().int().positive() }).parse(input)).handler(createSsrRpc("4096b2026b038348e3866bd521ecc67e4d87fd9fb2bcbcb5a8b133f4d5ff293e"));
var getCurrentDelivery = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ba32516f755dd325f1963700893b89e65dd1767b32b7efb896e9aebdc1254d9b"));
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => placeSchema.parse(input)).handler(createSsrRpc("eff383686543aaf1d3781cf0aaa6a0b80974ddd9537d83f9cfc933b88b01f00f"));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive(),
	reason: string().trim().max(200).optional()
}).parse(input)).handler(createSsrRpc("ce04adca7d8cf2e5655362378bfcda50dea2e05cc45f2f7d630ee90c323d90db"));
//#endregion
export { notifyCustomer as a, listMyOrders as i, getCurrentDelivery as n, placeOrder as o, getMyOrder as r, cancelMyOrder as t };

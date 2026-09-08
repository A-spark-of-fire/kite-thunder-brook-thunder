import { r as createServerFn } from "./ssr.mjs";
import { r as ORDER_STATUSES } from "./agency-dJTRPtCM.mjs";
import { a as indianMobile } from "./utils-sqhcPpa2.mjs";
import { t as authMiddleware } from "./middleware--6meZ4AD.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-ncbwCwg6.js
var getAdminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6406231809d31ba8950a82a40792322c0625536ab6f17170901260c406565838"));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ status: string().optional() }).optional().parse(input ?? {})).handler(createSsrRpc("588d427c5c6a9bd05e1014cec0ec3321b2ef1da275509094279b6af46ea31f4e"));
var adminGetOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ id: number().int().positive() }).parse(input)).handler(createSsrRpc("0623f380e2e38cdfa24239b07087a46e8a338e90f061f9eb41c74a4a70e8eff9"));
var adminUpdateOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive(),
	status: _enum(ORDER_STATUSES).optional(),
	preferredDate: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	timeSlot: _enum([
		"morning",
		"afternoon",
		"evening"
	]).optional(),
	assignedAgentId: number().int().positive().nullable().optional(),
	note: string().trim().max(240).optional()
}).parse(input)).handler(createSsrRpc("1adf2a1e37f75fbf14db6c1c320664b023c54d351730c8615d2801c49c5eee75"));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e44d25be80bce2b94deb72faf36c4882bfe3911806ab70b7b500f221420cd68e"));
var adminSaveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive().optional(),
	name: string().trim().min(2).max(80),
	sizeLabel: string().trim().min(1).max(40),
	sizeMl: number().int().min(0).max(1e5),
	unitPrice: number().min(0).max(1e5),
	description: string().trim().max(240).optional().default(""),
	artKey: string().trim().max(20).optional().default("jar20"),
	isActive: boolean(),
	sortOrder: number().int().min(0).max(999).optional().default(0)
}).parse(input)).handler(createSsrRpc("d1945e7f257482ecf2137acde558fe8edd242c8fb898534842dc62c930a26d2d"));
var adminListCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("96c3c90be288da29c9bf1bf1ed992ffb93d3fc3eb0f0cb071e84d713b896418f"));
var adminListAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("baa3978ec8f136fead3ca9c175d46f72554d51657981651e8ad14ce9b2c08598"));
var adminSaveAgent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: number().int().positive().optional(),
	name: string().trim().min(2).max(80),
	phone: string().trim().refine(indianMobile, "Enter a valid mobile number"),
	isActive: boolean()
}).parse(input)).handler(createSsrRpc("97c976fe3449882df65ec2917d62762b8ce923ecd6009cbcb59be4b6aebcd1b0"));
var adminListPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("da559204811580d85f5d2d3a84fe0377e4f596fe27a42bb22c5c70d8ad73226b"));
var adminTogglePayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	id: string().min(1),
	enabled: boolean()
}).parse(input)).handler(createSsrRpc("422b2e31d50b0e09bf8c7a44776c9efec144c72b1287bfdea87be67de3290400"));
var adminGetSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7c6b82e0ce0bba37c904ef67f1d4882c6dde8ee39f59dcea6d97c8935c479940"));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	brandName: string().trim().min(2).max(40),
	companyName: string().trim().min(2).max(80),
	proprietor: string().trim().min(2).max(80),
	phonePrimary: string().trim().min(8).max(15),
	phoneSecondary: string().trim().max(15).optional().default(""),
	email: string().trim().email(),
	addressLine: string().trim().min(8).max(240),
	fssai: string().trim().max(40).optional().default(""),
	upiId: string().trim().max(80).optional().default("")
}).parse(input)).handler(createSsrRpc("4559ed6bf9a7b05c02163e5741d4be1b6008bb0bb52c25c4782cb2fe0f4383ca"));
var adminListInbox = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9eb5cf55c176a07ab91c61ccd909b5ee4ed2f3c8b3207e785de245a6114e8a28"));
//#endregion
export { adminListInbox as a, adminListProducts as c, adminSaveSettings as d, adminTogglePayment as f, adminListCustomers as i, adminSaveAgent as l, getAdminStats as m, adminGetSettings as n, adminListOrders as o, adminUpdateOrder as p, adminListAgents as r, adminListPayments as s, adminGetOrder as t, adminSaveProduct as u };

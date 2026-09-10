import { n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as getMe, t as createSsrRpc } from "./profile-Qkt-X-zb.mjs";
import { i as listMyOrders, n as getCurrentDelivery, r as getMyOrder } from "./orders-DE-DidE_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-Y89j3blD.js
var listProducts = createServerFn({ method: "GET" }).handler(createSsrRpc("2f3cb902609e50ac96044f7e96228fa2f59f70d4c357ba5479010af2a225aea2"));
var listPaymentMethods = createServerFn({ method: "GET" }).handler(createSsrRpc("09cfdbca90d4db091d412f337439eb515ac2d763c3ff8aa0f26c068a918c5353"));
var getPublicSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("3e015ee0154b56b9cd44db361c2e0978e439d608cdf1c8d2722a5c5a7fd45965"));
function useMe(enabled = true) {
	return useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled
	});
}
function useProducts() {
	return useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
}
function usePaymentMethods() {
	return useQuery({
		queryKey: ["payments"],
		queryFn: () => listPaymentMethods()
	});
}
function usePublicSettings() {
	return useQuery({
		queryKey: ["settings-public"],
		queryFn: () => getPublicSettings()
	});
}
function useMyOrders(enabled = true) {
	return useQuery({
		queryKey: ["my-orders"],
		queryFn: () => listMyOrders(),
		enabled
	});
}
function useMyOrder(id, enabled = true) {
	return useQuery({
		queryKey: ["my-order", id],
		queryFn: () => getMyOrder({ data: { id } }),
		enabled
	});
}
function useCurrentDelivery(enabled = true) {
	return useQuery({
		queryKey: ["current-delivery"],
		queryFn: () => getCurrentDelivery(),
		enabled,
		refetchInterval: 2e4
	});
}
//#endregion
export { usePaymentMethods as a, useMyOrders as i, useMe as n, useProducts as o, useMyOrder as r, usePublicSettings as s, useCurrentDelivery as t };

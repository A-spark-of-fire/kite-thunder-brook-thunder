import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/server/profile";
import { getCurrentDelivery, getMyOrder, listMyOrders } from "@/lib/server/orders";
import { getPublicSettings, listPaymentMethods, listProducts } from "@/lib/server/catalog";

export function useMe(enabled = true) {
  return useQuery({ queryKey: ["me"], queryFn: () => getMe(), enabled });
}
export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
}
export function usePaymentMethods() {
  return useQuery({ queryKey: ["payments"], queryFn: () => listPaymentMethods() });
}
export function usePublicSettings() {
  return useQuery({ queryKey: ["settings-public"], queryFn: () => getPublicSettings() });
}
export function useMyOrders(enabled = true) {
  return useQuery({ queryKey: ["my-orders"], queryFn: () => listMyOrders(), enabled });
}
export function useMyOrder(id: number, enabled = true) {
  return useQuery({ queryKey: ["my-order", id], queryFn: () => getMyOrder({ data: { id } }), enabled });
}
export function useCurrentDelivery(enabled = true) {
  return useQuery({ queryKey: ["current-delivery"], queryFn: () => getCurrentDelivery(), enabled, refetchInterval: 20_000 });
}

import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import type { AgencySettings, PaymentMethod, Product } from "@/lib/types";
import { mapPayment, mapProduct, mapSettings } from "./map";

export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`select * from products where is_active = true order by sort_order, id`;
  return rows.map(mapProduct);
});

export const listPaymentMethods = createServerFn({ method: "GET" }).handler(async (): Promise<PaymentMethod[]> => {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`select * from payment_methods where enabled = true order by sort_order`;
  return rows.map(mapPayment);
});

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async (): Promise<AgencySettings> => {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`select * from agency_settings where id = 1`;
  return mapSettings(rows[0]);
});

import type { OrderStatus } from "@/lib/agency";
import { money } from "@/lib/utils";
import type {
  Address, AddressInput, AgencySettings, DeliveryAgent, NotificationItem,
  Order, OrderItem, PaymentMethod, Product, Profile, Role, StatusEvent,
} from "@/lib/types";

export function asObj(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch { return {}; }
  }
  return {};
}

export function asArr<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed as T[];
    } catch { return []; }
  }
  return [];
}

export function str(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}
export function num(value: unknown): number { return money(value as string | number | null); }
export function bool(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

export function mapAddress(row: Record<string, unknown>): Address {
  return {
    id: num(row.id), userId: str(row.user_id), label: str(row.label, "Home"),
    line1: str(row.line1), line2: str(row.line2), city: str(row.city),
    state: str(row.state, "West Bengal"), pincode: str(row.pincode),
    landmark: str(row.landmark), isDefault: bool(row.is_default),
  };
}

export function mapAddressSnapshot(raw: unknown): AddressInput & { label?: string } {
  const o = asObj(raw);
  return {
    label: str(o.label, "Home"), line1: str(o.line1), line2: str(o.line2),
    city: str(o.city), state: str(o.state, "West Bengal"), pincode: str(o.pincode), landmark: str(o.landmark),
  };
}

export function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: num(row.id), name: str(row.name), sizeLabel: str(row.size_label), sizeMl: num(row.size_ml),
    unitPrice: num(row.unit_price), description: str(row.description), artKey: str(row.art_key, "jar20"),
    isActive: bool(row.is_active), sortOrder: num(row.sort_order),
  };
}

export function mapPayment(row: Record<string, unknown>): PaymentMethod {
  return { id: str(row.id), label: str(row.label), description: str(row.description), enabled: bool(row.enabled), sortOrder: num(row.sort_order) };
}

export function mapSettings(row: Record<string, unknown> | undefined): AgencySettings {
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
    upiId: str(r.upi_id),
  };
}

export function mapAgent(row: Record<string, unknown>): DeliveryAgent {
  return { id: num(row.id), name: str(row.name), phone: str(row.phone), isActive: bool(row.is_active) };
}

export function mapItem(row: Record<string, unknown>): OrderItem {
  return {
    id: num(row.id), productId: row.product_id == null ? null : num(row.product_id),
    productName: str(row.product_name), sizeLabel: str(row.size_label),
    unitPrice: num(row.unit_price), quantity: num(row.quantity), lineTotal: num(row.line_total),
  };
}

export function mapHistory(row: Record<string, unknown>): StatusEvent {
  return { id: num(row.id), status: str(row.status, "placed") as OrderStatus, note: str(row.note), createdAt: str(row.created_at) };
}

export function mapNotification(row: Record<string, unknown>): NotificationItem {
  return {
    id: num(row.id), title: str(row.title), body: str(row.body),
    orderId: row.order_id == null ? null : num(row.order_id), isRead: bool(row.is_read), createdAt: str(row.created_at),
  };
}

export function mapOrder(row: Record<string, unknown>, extras?: { items?: OrderItem[]; history?: StatusEvent[] }): Order {
  const agentId = row.agent_id ?? row.assigned_agent_id;
  const assignedAgent =
    agentId != null && str(row.agent_name || row.assigned_name)
      ? { id: num(agentId), name: str(row.agent_name || row.assigned_name), phone: str(row.agent_phone || row.assigned_phone) }
      : null;
  return {
    id: num(row.id), orderNumber: str(row.order_number), userId: str(row.user_id),
    status: str(row.status, "placed") as OrderStatus, address: mapAddressSnapshot(row.address_snapshot),
    preferredDate: str(row.preferred_date), timeSlot: str(row.time_slot), note: str(row.note),
    paymentMethod: str(row.payment_method, "cod"), paymentStatus: str(row.payment_status, "pending"),
    subtotal: num(row.subtotal), total: num(row.total), assignedAgent,
    expectedDate: row.expected_date ? str(row.expected_date) : null,
    deliveredAt: row.delivered_at ? str(row.delivered_at) : null,
    cancelledAt: row.cancelled_at ? str(row.cancelled_at) : null,
    cancelReason: str(row.cancel_reason), createdAt: str(row.created_at),
    items: extras?.items ?? asArr<Record<string, unknown>>(row.items).map(mapItem),
    history: extras?.history ?? asArr<Record<string, unknown>>(row.history).map(mapHistory),
    customerName: row.customer_name ? str(row.customer_name) : undefined,
    customerMobile: row.customer_mobile ? str(row.customer_mobile) : undefined,
  };
}

export function mapProfile(
  row: Record<string, unknown>,
  opts: { canAccessAdmin: boolean; adminExists: boolean; address: Address | null },
): Profile {
  return {
    userId: str(row.user_id), role: (str(row.role, "customer") as Role) || "customer",
    fullName: str(row.full_name), mobile: str(row.mobile), altMobile: str(row.alt_mobile),
    email: row.email ? str(row.email) : null, image: row.image ? str(row.image) : null,
    canAccessAdmin: opts.canAccessAdmin, adminExists: opts.adminExists, address: opts.address,
  };
}

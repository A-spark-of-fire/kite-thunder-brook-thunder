import type { OrderStatus, TimeSlotId } from "./agency";

export type Role = "customer" | "admin" | "staff";

export type Address = {
  id: number; userId: string; label: string; line1: string; line2: string;
  city: string; state: string; pincode: string; landmark: string; isDefault: boolean;
};

export type AddressInput = {
  label: string; line1: string; line2?: string; city: string; state: string;
  pincode: string; landmark?: string;
};

export type Product = {
  id: number; name: string; sizeLabel: string; sizeMl: number; unitPrice: number;
  description: string; artKey: string; isActive: boolean; sortOrder: number;
};

export type PaymentMethod = {
  id: string; label: string; description: string; enabled: boolean; sortOrder: number;
};

export type AgencySettings = {
  brandName: string; companyName: string; proprietor: string; phonePrimary: string;
  phoneSecondary: string; email: string; addressLine: string; fssai: string; upiId: string;
};

export type Profile = {
  userId: string; role: Role; fullName: string; mobile: string; altMobile: string;
  email: string | null; image: string | null; canAccessAdmin: boolean;
  adminExists: boolean; address: Address | null;
};

export type OrderItem = {
  id: number; productId: number | null; productName: string; sizeLabel: string;
  unitPrice: number; quantity: number; lineTotal: number;
};

export type DeliveryAgent = { id: number; name: string; phone: string; isActive: boolean };

export type StatusEvent = { id: number; status: OrderStatus; note: string; createdAt: string };

export type Order = {
  id: number; orderNumber: string; userId: string; status: OrderStatus;
  address: AddressInput & { label?: string }; preferredDate: string;
  timeSlot: TimeSlotId | string; note: string; paymentMethod: string; paymentStatus: string;
  subtotal: number; total: number;
  assignedAgent: { id: number; name: string; phone: string } | null;
  expectedDate: string | null; deliveredAt: string | null; cancelledAt: string | null;
  cancelReason: string; createdAt: string; items: OrderItem[]; history: StatusEvent[];
  customerName?: string; customerMobile?: string;
};

export type NotificationItem = {
  id: number; title: string; body: string; orderId: number | null; isRead: boolean; createdAt: string;
};

export type MePayload = { profile: Profile; settings: AgencySettings; unreadCount: number };

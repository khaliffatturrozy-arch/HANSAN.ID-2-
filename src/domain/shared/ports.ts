/**
 * Core repository ports: identity/tenancy, orders (POS), catalog.
 * CONVENTION: async, THROW AppError on failure; empty results are
 * valid; adapters must never invent business records.
 */

// ---------- identity / tenancy ----------
export interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  role: string;
  tenantId: string;
  outletIds: string[];
  active: boolean;
  createdAt: string;
}

export interface OutletRecord {
  id: string;
  tenantId: string;
  name: string;
  active: boolean;
}

export interface UserPort {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  listByTenant(tenantId: string): Promise<UserRecord[]>;
  listOutlets(tenantId: string): Promise<OutletRecord[]>;
}

// ---------- orders (POS) ----------
export type OrderState =
  | "draft"
  | "placed"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "refund_requested"
  | "refunded";

export type PaymentState = "unpaid" | "paid" | "refunding" | "refunded";

export type OrderType = "dine-in" | "take-away" | "online";

export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceIdr: number;
  modifierIds: string[];
  station: "kitchen" | "bar";
  state: "active" | "cancelled";
  /** KDS item-level preparation status (Phase A3). */
  prepStatus?: "pending" | "preparing" | "ready";
  note?: string;
}

export interface OrderRecord {
  id: string;
  tenantId: string;
  outletId: string;
  orderNumber: string;
  orderType: OrderType;
  tableId: string | null;
  customerId: string | null;
  lines: OrderLine[];
  subtotalIdr: number;
  discountIdr: number;
  taxIdr: number;
  grandTotalIdr: number;
  state: OrderState;
  paymentState: PaymentState;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPort {
  findById(id: string): Promise<OrderRecord | null>;
  save(order: OrderRecord): Promise<void>;
  listByOutlet(outletId: string, options?: { limit?: number; sinceIso?: string }): Promise<OrderRecord[]>;
  listByTenant(tenantId: string, options?: { limit?: number; sinceIso?: string }): Promise<OrderRecord[]>;
  nextOrderNumber(outletId: string): Promise<string>;
}

// ---------- catalog ----------
export interface ProductRecord {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  priceIdr: number;
  station: "kitchen" | "bar";
  active: boolean;
  createdAt: string;
}

export interface CatalogPort {
  findById(id: string): Promise<ProductRecord | null>;
  listActive(tenantId: string): Promise<ProductRecord[]>;
}

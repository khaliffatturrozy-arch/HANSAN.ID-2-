/** Customer, reservation, table, loyalty repository ports (Phase A7). */

export interface CustomerRecord {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  membershipTier: "none" | "silver" | "gold" | "platinum";
  createdAt: string;
}

export interface ReservationRecord {
  id: string;
  tenantId: string;
  outletId: string;
  customerId: string | null;
  guestCount: number;
  tableId: string | null;
  floorId: string;
  startAt: string;
  endAt: string;
  status: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";
  note: string | null;
  createdAt: string;
}

export interface TableRecord {
  id: string;
  tenantId: string;
  outletId: string;
  floorId: string;
  name: string;
  capacity: number;
  positionX: number;
  positionY: number;
  minOrderIdr: number;
  active: boolean;
}

export interface VoucherRecord {
  id: string;
  tenantId: string;
  code: string;
  kind: "percent" | "fixed";
  value: number;
  active: boolean;
  expiresAt: string | null;
  usageLimit: number;
  usedCount: number;
}

export interface CustomerPort {
  getCustomer(id: string): Promise<CustomerRecord | null>;
  saveCustomer(customer: CustomerRecord): Promise<void>;
  listCustomers(tenantId: string): Promise<CustomerRecord[]>;
}

export interface ReservationPort {
  getReservation(id: string): Promise<ReservationRecord | null>;
  saveReservation(r: ReservationRecord): Promise<void>;
  listByDay(outletId: string, dayIso: string): Promise<ReservationRecord[]>;
}

export interface TablePort {
  getTable(id: string): Promise<TableRecord | null>;
  listTables(outletId: string): Promise<TableRecord[]>;
}

export interface LoyaltyPort {
  getVoucherByCode(tenantId: string, code: string): Promise<VoucherRecord | null>;
  saveVoucher(v: VoucherRecord): Promise<void>;
}

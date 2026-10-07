/**
 * POS API contracts (Phase A2) — request schemas (validation) and
 * derived read models (receipt, order history). Receipts are DERIVED
 * from OrderRecord at read time; no duplicate receipt storage.
 */
import * as v from "@/domain/shared/validation";
import type { Validation } from "@/domain/shared/validation";
import type { OrderRecord, OrderType } from "@/domain/shared/ports";
import { computeTotals, type TaxConfig } from "@/domain/pos/totals";

// ---------- requests ----------
export const createOrderSchema = v.object({
  orderType: v.oneOf(["dine-in", "take-away", "online"] as const),
  tableId: v.optional(v.string({ maxLength: 64 })),
  customerId: v.optional(v.string({ maxLength: 64 })),
  discountIdr: v.optional(v.int({ min: 0, max: 1_000_000_000 })),
  lines: v.array(
    v.object({
      productId: v.string({ maxLength: 64 }),
      quantity: v.int({ min: 1, max: 999 }),
      modifierIds: v.optional(v.array(v.string({ maxLength: 64 }))),
      note: v.optional(v.string({ maxLength: 200 })),
    }),
    { minLength: 1, maxLength: 200 },
  ),
});

export type CreateOrderRequest = {
  orderType: OrderType;
  tableId?: string;
  customerId?: string;
  discountIdr?: number;
  lines: { productId: string; quantity: number; modifierIds?: string[]; note?: string }[];
};

export const transitionSchema = v.object({
  to: v.string({ maxLength: 32 }),
});

export const cancelOrderSchema = v.object({
  reason: v.string({ minLength: 3, maxLength: 200 }),
});

export function parseCreateOrder(input: unknown): Validation<CreateOrderRequest> {
  return createOrderSchema(input, "$");
}

// ---------- read models ----------
export interface ReceiptLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceIdr: number;
  lineTotalIdr: number;
}

export interface ReceiptContract {
  orderId: string;
  orderNumber: string;
  issuedAt: string;
  orderType: OrderType;
  lines: ReceiptLine[];
  subtotalIdr: number;
  discountIdr: number;
  taxIdr: number;
  grandTotalIdr: number;
  taxLabel: string;
  paid: boolean;
  cashierId: string;
}

export function buildReceipt(order: OrderRecord, tax: TaxConfig): ReceiptContract {
  const active = order.lines.filter((l) => l.state === "active");
  const totals = computeTotals({
    subtotalIdr: active.reduce((s, l) => s + l.quantity * l.unitPriceIdr, 0),
    discountIdr: order.discountIdr,
    tax,
  });
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    issuedAt: order.updatedAt,
    orderType: order.orderType,
    lines: active.map((l) => ({
      productId: l.productId,
      productName: l.productName,
      quantity: l.quantity,
      unitPriceIdr: l.unitPriceIdr,
      lineTotalIdr: l.quantity * l.unitPriceIdr,
    })),
    subtotalIdr: totals.subtotalIdr,
    discountIdr: totals.discountIdr,
    taxIdr: totals.taxIdr,
    grandTotalIdr: totals.grandTotalIdr,
    taxLabel: tax.label,
    paid: order.paymentState === "paid" || order.paymentState === "refunding" || order.paymentState === "refunded",
    cashierId: order.createdBy,
  };
}

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  state: OrderRecord["state"];
  paymentState: OrderRecord["paymentState"];
  grandTotalIdr: number;
  createdAt: string;
  completedAt: string | null;
}

export interface OrderHistoryQuery {
  outletId: string;
  limit: number;
  sinceIso?: string;
}

export function toHistoryItem(order: OrderRecord): OrderHistoryItem {
  const settled = order.state === "completed" || order.state === "refunded" || order.state === "refund_requested";
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    orderType: order.orderType,
    state: order.state,
    paymentState: order.paymentState,
    grandTotalIdr: order.grandTotalIdr,
    createdAt: order.createdAt,
    completedAt: settled ? order.updatedAt : null,
  };
}

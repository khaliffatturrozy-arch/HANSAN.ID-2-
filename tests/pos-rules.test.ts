import { describe, expect, it } from "vitest";
import { canCancelOrder, canCapturePayment, isRefundEligible, validateOrderAssociations } from "@/domain/pos/rules";
import { buildReceipt } from "@/domain/pos/contracts";
import { computeTotals } from "@/domain/pos/totals";
import type { OrderRecord } from "@/domain/shared/ports";
import { ERROR_CODES } from "@/domain/shared/errors";

function order(overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: "ord_1",
    tenantId: "ten_test",
    outletId: "out_1",
    orderNumber: "ORD-00001",
    orderType: "dine-in",
    tableId: "tbl_1",
    customerId: null,
    lines: [
      { id: "l1", productId: "p1", productName: "Nasi Goreng", quantity: 2, unitPriceIdr: 25_000, modifierIds: [], station: "kitchen", state: "active" },
    ],
    subtotalIdr: 50_000,
    discountIdr: 0,
    taxIdr: 0,
    grandTotalIdr: 50_000,
    state: "placed",
    paymentState: "unpaid",
    createdBy: "usr_pos",
    createdAt: "2026-01-01T10:00:00.000Z",
    updatedAt: "2026-01-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("pos rules", () => {
  it("dine-in requires table; online requires customer", () => {
    expect(validateOrderAssociations("dine-in", { tableId: null, customerId: null }).ok).toBe(false);
    expect(validateOrderAssociations("dine-in", { tableId: "t1", customerId: null }).ok).toBe(true);
    expect(validateOrderAssociations("online", { tableId: null, customerId: null }).ok).toBe(false);
    expect(validateOrderAssociations("take-away", { tableId: null, customerId: null }).ok).toBe(true);
  });

  it("paid orders cannot be cancelled", () => {
    const r = canCancelOrder(order({ paymentState: "paid" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe(ERROR_CODES.CANCELLATION_NOT_ALLOWED);
  });

  it("refund eligibility: completed + paid + within window", () => {
    const now = new Date("2026-01-02T10:00:00.000Z");
    const base = order({ state: "completed", paymentState: "paid", updatedAt: "2026-01-01T10:00:00.000Z" });
    expect(isRefundEligible(base, now).ok).toBe(true);
    expect(isRefundEligible(order({ state: "placed", paymentState: "paid" }), now).ok).toBe(false);
    expect(isRefundEligible(order({ state: "completed", paymentState: "unpaid" }), now).ok).toBe(false);
    const tooOld = order({ state: "completed", paymentState: "paid", updatedAt: "2025-12-01T00:00:00.000Z" });
    expect(isRefundEligible(tooOld, now).ok).toBe(false);
  });

  it("payment capture guards", () => {
    expect(canCapturePayment(order({ state: "placed", paymentState: "unpaid" })).ok).toBe(true);
    expect(canCapturePayment(order({ state: "placed", paymentState: "paid" })).ok).toBe(false);
    expect(canCapturePayment(order({ state: "cancelled", paymentState: "unpaid" })).ok).toBe(false);
    expect(canCapturePayment(order({ state: "draft", paymentState: "unpaid" })).ok).toBe(false);
  });
});

describe("receipt + totals", () => {
  it("derives receipt from order with tax", () => {
    const receipt = buildReceipt(order({ state: "completed", paymentState: "paid" }), { percent: 11, label: "PPN" });
    expect(receipt.lines).toHaveLength(1);
    expect(receipt.subtotalIdr).toBe(50_000);
    expect(receipt.taxIdr).toBe(5_500);
    expect(receipt.grandTotalIdr).toBe(55_500);
    expect(receipt.paid).toBe(true);
    expect(receipt.orderNumber).toBe("ORD-00001");
  });

  it("totals: discount then tax, empty = zeros", () => {
    const t = computeTotals({ subtotalIdr: 100_000, discountIdr: 10_000, tax: { percent: 11, label: "PPN" } });
    expect(t.grandTotalIdr).toBe(99_900);
    const empty = computeTotals({ subtotalIdr: 0, discountIdr: 0, tax: { percent: 11, label: "PPN" } });
    expect(empty.grandTotalIdr).toBe(0);
    const clamped = computeTotals({ subtotalIdr: 5_000, discountIdr: 99_999, tax: { percent: 0, label: "x" } });
    expect(clamped.discountIdr).toBe(5_000);
    expect(clamped.grandTotalIdr).toBe(0);
  });
});

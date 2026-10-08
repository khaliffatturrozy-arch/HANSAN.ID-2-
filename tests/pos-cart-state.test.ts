import { describe, expect, it } from "vitest";
import { cartAdd, cartRemove, cartSetDiscount, cartSetQuantity, cartSubtotalIdr, EMPTY_CART } from "@/domain/pos/cart";
import { canTransitionOrder, canTransitionPayment, assertOrderTransition, ORDER_TRANSITIONS } from "@/domain/pos/order-state";
import { ERROR_CODES } from "@/domain/shared/errors";

describe("cart", () => {
  it("adds and merges identical lines", () => {
    const a = cartAdd(EMPTY_CART, { id: "l1", productId: "p1", productName: "Es Teh", quantity: 1, unitPriceIdr: 10_000, station: "bar" });
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    const b = cartAdd(a.value, { id: "l2", productId: "p1", productName: "Es Teh", quantity: 2, unitPriceIdr: 10_000, station: "bar" });
    expect(b.ok).toBe(true);
    if (!b.ok) return;
    expect(b.value.lines).toHaveLength(1);
    expect(b.value.lines[0].quantity).toBe(3);
    expect(cartSubtotalIdr(b.value)).toBe(30_000);
  });

  it("keeps different modifiers separate", () => {
    const a = cartAdd(EMPTY_CART, { id: "l1", productId: "p1", productName: "Kopi", quantity: 1, unitPriceIdr: 20_000, station: "bar", modifierIds: ["m_sugar"] });
    if (!a.ok) throw new Error("setup");
    const b = cartAdd(a.value, { id: "l2", productId: "p1", productName: "Kopi", quantity: 1, unitPriceIdr: 20_000, station: "bar", modifierIds: ["m_ice"] });
    if (!b.ok) throw new Error("setup");
    expect(b.value.lines).toHaveLength(2);
  });

  it("rejects invalid quantities and prices", () => {
    expect(cartAdd(EMPTY_CART, { id: "x", productId: "p", productName: "n", quantity: 0, unitPriceIdr: 100, station: "kitchen" }).ok).toBe(false);
    expect(cartAdd(EMPTY_CART, { id: "x", productId: "p", productName: "n", quantity: 1, unitPriceIdr: -5, station: "kitchen" }).ok).toBe(false);
    expect(cartSetQuantity({ lines: [], discountIdr: 0 }, "missing", 2).ok).toBe(false);
    expect(cartSetDiscount({ lines: [], discountIdr: 0 }, -1).ok).toBe(false);
  });

  it("removes lines", () => {
    const added = cartAdd(EMPTY_CART, { id: "l1", productId: "p1", productName: "X", quantity: 1, unitPriceIdr: 1000, station: "kitchen" });
    if (!added.ok) throw new Error("setup");
    expect(cartRemove(added.value, "l1").lines).toHaveLength(0);
  });
});

describe("order state machine", () => {
  it("allows the pipeline only forward", () => {
    expect(canTransitionOrder("placed", "accepted")).toBe(true);
    expect(canTransitionOrder("preparing", "ready")).toBe(true);
    expect(canTransitionOrder("ready", "completed")).toBe(true);
    expect(canTransitionOrder("completed", "refunded")).toBe(false);
    expect(canTransitionOrder("cancelled", "placed")).toBe(false);
    expect(canTransitionOrder("refunded", "completed")).toBe(false);
  });

  it("throws INVALID_ORDER_STATE", () => {
    expect(() => assertOrderTransition("completed", "placed")).toThrowError();
    try {
      assertOrderTransition("completed", "placed");
      throw new Error("should throw");
    } catch (e) {
      expect((e as { code?: string }).code).toBe(ERROR_CODES.INVALID_ORDER_STATE);
    }
  });

  it("transition tables are exhaustive", () => {
    for (const targets of Object.values(ORDER_TRANSITIONS)) {
      expect(Array.isArray(targets)).toBe(true);
    }
  });

  it("payment transitions", () => {
    expect(canTransitionPayment("unpaid", "paid")).toBe(true);
    expect(canTransitionPayment("unpaid", "refunded")).toBe(false);
    expect(canTransitionPayment("paid", "refunding")).toBe(true);
    expect(canTransitionPayment("refunded", "paid")).toBe(false);
  });
});

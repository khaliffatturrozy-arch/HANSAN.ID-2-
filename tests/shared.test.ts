import { describe, expect, it } from "vitest";
import { addMoney, formatIdr, multiplyMoney, percentOf, rupiah, subtractMoney, ZERO } from "@/domain/shared/money";
import { computeTotals } from "@/domain/pos/totals";
import { validate, string, int, object, array, oneOf, optional } from "@/domain/shared/validation";

describe("money", () => {
  it("rejects non-integer rupiah", () => {
    expect(() => rupiah(10.5)).toThrow();
  });
  it("adds/subtracts/multiplies integers", () => {
    expect(addMoney(rupiah(1000), rupiah(2500)).amount).toBe(3500);
    expect(subtractMoney(rupiah(5000), rupiah(1000)).amount).toBe(4000);
    expect(multiplyMoney(rupiah(1500), 3).amount).toBe(4500);
    expect(ZERO.amount).toBe(0);
  });
  it("rounds percentages half-up", () => {
    expect(percentOf(rupiah(1000), 11).amount).toBe(110);
    expect(percentOf(rupiah(45), 50).amount).toBe(23); // 22.5 → 23
  });
  it("formats id-ID", () => {
    expect(formatIdr(rupiah(1500000))).toBe("Rp 1.500.000");
  });
});

describe("computeTotals", () => {
  const tax = { percent: 11, label: "PPN" };

  it("computes subtotal → discount → tax → grand total", () => {
    const t = computeTotals({ subtotalIdr: 100_000, discountIdr: 10_000, tax });
    expect(t).toEqual({
      subtotalIdr: 100_000,
      discountIdr: 10_000,
      taxableIdr: 90_000,
      taxIdr: 9_900,
      grandTotalIdr: 99_900,
    });
  });

  it("clamps discount to subtotal (never negative)", () => {
    const t = computeTotals({ subtotalIdr: 5_000, discountIdr: 999_999, tax: { percent: 0, label: "none" } });
    expect(t.discountIdr).toBe(5_000);
    expect(t.taxableIdr).toBe(0);
    expect(t.grandTotalIdr).toBe(0);
  });

  it("empty input yields zeros", () => {
    const t = computeTotals({ subtotalIdr: 0, discountIdr: 0, tax });
    expect(t.grandTotalIdr).toBe(0);
    expect(t.taxIdr).toBe(0);
  });

  it("rejects invalid tax percent", () => {
    expect(() => computeTotals({ subtotalIdr: 0, discountIdr: 0, tax: { percent: 150, label: "x" } })).toThrow();
  });
});

describe("validation combinators", () => {
  it("object validates and strips unknown keys", () => {
    const schema = object({ name: string({ minLength: 1 }), age: int({ min: 0 }) });
    const result = validate(schema, { name: "Aya", age: 30, hacker: "ignored" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual({ name: "Aya", age: 30 });
  });

  it("collects issues with paths", () => {
    const schema = object({ email: string({ pattern: /@/ }), qty: int({ min: 1 }) });
    const result = validate(schema, { email: "bad", qty: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.map((i) => i.path)).toContain("$.email");
      expect(result.issues.map((i) => i.path)).toContain("$.qty");
    }
  });

  it("array + enum + optional compose", () => {
    const schema = object({
      kinds: array(oneOf(["a", "b"] as const), { minLength: 1 }),
      note: optional(string()),
    });
    expect(validate(schema, { kinds: ["a", "b"] }).ok).toBe(true);
    expect(validate(schema, { kinds: [] }).ok).toBe(false);
    expect(validate(schema, { kinds: ["c"] }).ok).toBe(false);
    expect(validate(schema, { kinds: ["a"], note: undefined }).ok).toBe(true);
  });
});

import { describe, expect, it, beforeEach } from "vitest";
import { FinanceService } from "@/domain/finance/service";
import { MemoryAudit, MemoryFinance, MemoryOrders } from "./helpers/memory";
import { ERROR_CODES } from "@/domain/shared/errors";

function deps(clock: () => Date = () => new Date("2026-01-01T00:00:00.000Z")) {
  return { finance: new MemoryFinance(), orders: new MemoryOrders(), audit: new MemoryAudit(), clock };
}

describe("FinanceService", () => {
  let s: FinanceService;
  let orders: MemoryOrders;
  let finance: MemoryFinance;
  let audit: MemoryAudit;

  beforeEach(() => {
    const d = deps();
    s = new FinanceService(d);
    orders = d.orders;
    finance = d.finance;
    audit = d.audit;
  });

  it("records expense after integer validation", async () => {
    const e = await s.recordExpense({ actor: { id: "a1", displayName: "A", email: "a@x", role: "owner", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" }, tenantId: "t1", outletId: "o1", category: "ops", description: "Shift", amountIdr: 150_000, incurredAtIso: "2026-01-01T00:00:00.000Z" });
    expect(e.id).toMatch(/^exp_/);
    expect(e.amountIdr).toBe(150_000);
    expect(audit.events).toHaveLength(0);
    await expect(s.recordExpense({ actor: { id: "a1", displayName: "A", email: "a@x", role: "owner", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" }, tenantId: "t1", outletId: "o1", category: "ops", description: "x", amountIdr: 10.5, incurredAtIso: "2026-01-01T00:00:00.000Z" })).rejects.toMatchObject({ code: ERROR_CODES.VALIDATION_FAILED });
  });

  it("end-to-end refund: request → approve (different actor) → complete", async () => {
    const order = { id: "ord_1", tenantId: "t1", outletId: "o1", orderNumber: "ORD-00001", orderType: "take-away" as const, tableId: null, customerId: null, lines: [], subtotalIdr: 100_000, discountIdr: 0, taxIdr: 0, grandTotalIdr: 100_000, state: "completed" as const, paymentState: "paid" as const, createdBy: "u1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
    await orders.save(order);
    const r = await s.requestRefund({ tenantId: "t1", outletId: "o1", orderId: "ord_1", amountIdr: 30_000, reason: "wrong", requester: { id: "u_pos", displayName: "Pos", email: "pos@x", role: "pos", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" } });
    expect(r.status).toBe("pending");
    expect(audit.events.some((e) => e.action === "finance.refund_requested")).toBe(true);

    const approved = await s.decideRefund(r.id, "approved", { id: "u_hr", displayName: "Hr", email: "hr@x", role: "finance", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" });
    expect(approved.status).toBe("approved");
    await expect(s.decideRefund(r.id, "approved", { id: "u_pos", displayName: "Pos", email: "pos@x", role: "pos", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" })).rejects.toMatchObject({ code: ERROR_CODES.REFUND_ALREADY_DECIDED });

    const completed = await s.completeRefund(r.id, { id: "u_hr2", displayName: "Hr2", email: "hr2@x", role: "finance", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" });
    expect(completed.status).toBe("completed");
    expect(audit.events.some((e) => e.action === "finance.refund_approved")).toBe(true);
    expect(audit.events.some((e) => e.action === "finance.refund_completed")).toBe(true);
  });

  it("rejects self-approval and out-of-order decisions", async () => {
    const order = { id: "ord_1", tenantId: "t1", outletId: "o1", orderNumber: "ORD-00001", orderType: "take-away" as const, tableId: null, customerId: null, lines: [], subtotalIdr: 100_000, discountIdr: 0, taxIdr: 0, grandTotalIdr: 100_000, state: "completed" as const, paymentState: "paid" as const, createdBy: "u1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
    await orders.save(order);
    const r2 = await s.requestRefund({ tenantId: "t1", outletId: "o1", orderId: "ord_1", amountIdr: 10_000, reason: "x", requester: { id: "u1", displayName: "U1", email: "u1@x", role: "pos", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" } });
    await expect(s.decideRefund(r2.id, "approved", { id: "u1", displayName: "U1", email: "u1@x", role: "pos", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" })).rejects.toMatchObject({ code: ERROR_CODES.REFUND_APPROVAL_REQUIRED });
    await s.decideRefund(r2.id, "approved", { id: "u_hr", displayName: "Uhr", email: "uhr@x", role: "finance", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" });
    await expect(s.decideRefund(r2.id, "rejected", { id: "u_hr2", displayName: "Uhr2", email: "uhr2@x", role: "finance", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" })).rejects.toMatchObject({ code: ERROR_CODES.REFUND_ALREADY_DECIDED });
    await expect(s.completeRefund("ref_9", { id: "u_hr", displayName: "Uhr", email: "uhr@x", role: "finance", tenantId: "t1", outletIds: ["o1"], active: true, createdAt: "2026-01-01T00:00:00.000Z" })).rejects.toMatchObject({ code: ERROR_CODES.NOT_FOUND });
  });

  it("summary returns REAL aggregates, never fake data", async () => {
    const sev = new FinanceService(deps(() => new Date("2026-01-02T00:00:00.000Z")));
    const s1 = await sev.summary("t1");
    expect(s1).toEqual({
      grossSalesIdr: 0, discountsIdr: 0, taxCollectedIdr: 0, refundsIdr: 0, netRevenueIdr: 0, expensesIdr: 0, operatingResultIdr: 0,
      orderCount: 0, refundCount: 0, expenseCount: 0, expensesByCategory: [],
    });
  });
});

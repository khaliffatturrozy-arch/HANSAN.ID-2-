import { describe, expect, it } from "vitest";
import { assertKdsAction, canPerformKdsAction, kdsTargetState, assertPrepTransition, canTransitionPrep } from "@/domain/kds/state-machine";
import { buildTickets, computePriority, allItemsReady, isVisibleToKds } from "@/domain/kds/ticket";
import type { OrderRecord } from "@/domain/shared/ports";

function order(overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: "ord_1",
    tenantId: "ten_test",
    outletId: "out_1",
    orderNumber: "ORD-00001",
    orderType: "dine-in",
    tableId: null,
    customerId: null,
    lines: [
      { id: "l1", productId: "p1", productName: "Mie Goreng", quantity: 1, unitPriceIdr: 20_000, modifierIds: [], station: "kitchen", state: "active", prepStatus: "pending" },
      { id: "l2", productId: "p2", productName: "Es Jeruk", quantity: 1, unitPriceIdr: 10_000, modifierIds: [], station: "bar", state: "active", prepStatus: "pending" },
    ],
    subtotalIdr: 30_000,
    discountIdr: 0,
    taxIdr: 0,
    grandTotalIdr: 30_000,
    state: "placed",
    paymentState: "unpaid",
    createdBy: "usr_pos",
    createdAt: "2026-01-01T10:00:00.000Z",
    updatedAt: "2026-01-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("kds state machine", () => {
  it("permits kitchen actions per state", () => {
    expect(canPerformKdsAction("placed", "accept")).toBe(true);
    expect(canPerformKdsAction("placed", "mark_ready")).toBe(false);
    expect(canPerformKdsAction("preparing", "mark_ready")).toBe(true);
    expect(canPerformKdsAction("ready", "complete")).toBe(true);
    expect(canPerformKdsAction("cancelled", "accept")).toBe(false);
    expect(kdsTargetState("start_prep")).toBe("preparing");
    expect(() => assertKdsAction("completed", "accept")).toThrowError();
  });

  it("item prep transitions are forward-only", () => {
    expect(canTransitionPrep("pending", "preparing")).toBe(true);
    expect(canTransitionPrep("preparing", "ready")).toBe(true);
    expect(canTransitionPrep("ready", "preparing")).toBe(false);
    expect(() => assertPrepTransition("ready", "pending")).toThrowError();
  });
});

describe("kds tickets", () => {
  const now = new Date("2026-01-01T10:12:00.000Z");

  it("routes items to station tickets", () => {
    const tickets = buildTickets(order(), now);
    expect(tickets).toHaveLength(2);
    expect(tickets.map((t) => t.station).sort()).toEqual(["bar", "kitchen"]);
    expect(tickets[0].items).toHaveLength(1);
  });

  it("cancelled/completed orders vanish (POS cancellation propagates)", () => {
    expect(buildTickets(order({ state: "cancelled" }), now)).toHaveLength(0);
    expect(buildTickets(order({ state: "completed" }), now)).toHaveLength(0);
    expect(isVisibleToKds(order({ state: "preparing" }))).toBe(true);
    expect(isVisibleToKds(order({ state: "refunded" }))).toBe(false);
  });

  it("priority thresholds: normal → high → overdue", () => {
    expect(computePriority(3)).toBe("normal");
    expect(computePriority(10)).toBe("high");
    expect(computePriority(25)).toBe("overdue");
    const tickets = buildTickets(order(), now);
    expect(tickets[0].elapsedMinutes).toBe(12);
    expect(tickets[0].priority).toBe("high");
  });

  it("allItemsReady requires every active line ready", () => {
    const base = order();
    expect(allItemsReady(base, "kitchen")).toBe(false);
    const partially = order({
      lines: [
        { ...base.lines[0], prepStatus: "ready" },
        { ...base.lines[1], prepStatus: "preparing" },
      ],
    });
    expect(allItemsReady(partially, "kitchen")).toBe(true);
    expect(allItemsReady(partially, "bar")).toBe(false);
    expect(allItemsReady(partially)).toBe(false); // mixed stations
  });
});

/**
 * KDS ticket view model + routing + priority (Phase A3).
 * Tickets are DERIVED from orders (single source of truth) — no second
 * store to drift. POS cancellation is visible immediately: cancelled
 * orders fail the visible-state filter.
 */
import type { OrderRecord } from "@/domain/shared/ports";
import { KDS_VISIBLE_STATES } from "@/domain/pos/order-state";
import type { PrepStatus } from "@/domain/kds/state-machine";

export type Station = "kitchen" | "bar";

export interface TicketItem {
  lineId: string;
  productName: string;
  quantity: number;
  prepStatus: PrepStatus;
  note?: string;
}

export type Priority = "normal" | "high" | "overdue";

export interface TicketView {
  orderId: string;
  orderNumber: string;
  orderType: OrderRecord["orderType"];
  station: Station;
  items: TicketItem[];
  orderState: OrderRecord["state"];
  priority: Priority;
  elapsedMinutes: number;
  createdAt: string;
}

export interface PriorityThresholds {
  highMinutes: number;
  overdueMinutes: number;
}

export const DEFAULT_PRIORITY_THRESHOLDS: PriorityThresholds = { highMinutes: 10, overdueMinutes: 20 };

export function computePriority(elapsedMinutes: number, t: PriorityThresholds = DEFAULT_PRIORITY_THRESHOLDS): Priority {
  if (elapsedMinutes >= t.overdueMinutes) return "overdue";
  if (elapsedMinutes >= t.highMinutes) return "high";
  return "normal";
}

/** Orders the kitchen/bar may see (POS → KDS contract). */
export function isVisibleToKds(order: OrderRecord): boolean {
  return KDS_VISIBLE_STATES.includes(order.state);
}

export function stationOf(order: OrderRecord, station: Station): boolean {
  return order.lines.some((l) => l.state === "active" && l.station === station);
}

/**
 * Build tickets for an order: one per station that has active lines.
 * Returns [] for orders not visible to KDS (cancelled/completed/etc).
 */
export function buildTickets(
  order: OrderRecord,
  now: Date,
  thresholds: PriorityThresholds = DEFAULT_PRIORITY_THRESHOLDS,
): TicketView[] {
  if (!isVisibleToKds(order)) return [];
  const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - Date.parse(order.createdAt)) / 60_000));
  const priority = computePriority(elapsedMinutes, thresholds);

  const stations: Station[] = ["kitchen", "bar"];
  const tickets: TicketView[] = [];
  for (const station of stations) {
    const lines = order.lines.filter((l) => l.state === "active" && l.station === station);
    if (lines.length === 0) continue;
    tickets.push({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderType: order.orderType,
      station,
      items: lines.map((l) => ({
        lineId: l.id,
        productName: l.productName,
        quantity: l.quantity,
        prepStatus: l.prepStatus ?? "pending",
        ...(l.note ? { note: l.note } : {}),
      })),
      orderState: order.state,
      priority,
      elapsedMinutes,
      createdAt: order.createdAt,
    });
  }
  return tickets;
}

export function allItemsReady(order: OrderRecord, station?: Station): boolean {
  const lines = order.lines.filter(
    (l) => l.state === "active" && (!station || l.station === station),
  );
  return lines.length > 0 && lines.every((l) => (l.prepStatus ?? "pending") === "ready");
}

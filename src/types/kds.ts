/**
 * KDS Order-State Model — §8 / Phase 10 contract.
 * Cline owns this state machine. Copilot implements presentation only.
 *
 * States: new → preparing → ready → completed
 * No fake kitchen orders during UI sprint: initial state is empty.
 */

export const KDS_ORDER_STATES = ["new", "preparing", "ready", "completed"] as const;

export type KdsOrderState = (typeof KDS_ORDER_STATES)[number];

export const KDS_STATIONS = ["kitchen", "bar", "all", "priority", "completed"] as const;

export type KdsStation = (typeof KDS_STATIONS)[number];

export interface KdsOrder {
  id: string;
  station: "kitchen" | "bar";
  state: KdsOrderState;
  priority: boolean;
  createdAt: string;
  items: { name: string; qty: number; note?: string }[];
}

export const KDS_TRANSITIONS: Record<KdsOrderState, KdsOrderState | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: null,
};

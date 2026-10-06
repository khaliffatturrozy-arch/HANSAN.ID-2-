/**
 * POS Order-Flow Contract — §7 / Phase 9.
 * Cline owns flow + state shape. Copilot owns step presentation.
 *
 * Flow: login → home → order-type → table/customer → menu → add-item
 *   → cart → payment → receipt → complete → history
 * No real transaction persistence in UI sprint (§3).
 */

export const POS_ORDER_TYPES = ["dine-in", "take-away", "online"] as const;

export type PosOrderType = (typeof POS_ORDER_TYPES)[number];

export const POS_FLOW_STEPS = [
  "home",
  "order-type",
  "table-customer",
  "menu",
  "cart",
  "payment",
  "receipt",
  "complete",
  "history",
] as const;

export type PosFlowStep = (typeof POS_FLOW_STEPS)[number];

export interface PosCartItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  note?: string;
}

export interface PosOrderDraft {
  orderType: PosOrderType | null;
  tableOrCustomer: string | null;
  items: PosCartItem[];
  step: PosFlowStep;
}

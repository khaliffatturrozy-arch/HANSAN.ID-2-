/**
 * Order + payment state machines (Phase A2/A3).
 * Deterministic, exhaustive transition tables; every transition is
 * validated — unknown transitions are rejected, never silently applied.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import type { OrderState, PaymentState } from "@/domain/shared/ports";

export const ORDER_TRANSITIONS: Readonly<Record<OrderState, readonly OrderState[]>> = {
  draft: ["placed", "cancelled"],
  placed: ["accepted", "preparing", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: ["refund_requested"],
  cancelled: [],
  refund_requested: ["refunded", "completed"], // completed = refund rejected → order remains settled
  refunded: [],
};

export const PAYMENT_TRANSITIONS: Readonly<Record<PaymentState, readonly PaymentState[]>> = {
  unpaid: ["paid"], // paying a cancelled order is impossible: order state guards first
  paid: ["refunding"],
  refunding: ["refunded", "paid"], // paid = refund rejected → restore
  refunded: [],
};

export function canTransitionOrder(from: OrderState, to: OrderState): boolean {
  return ORDER_TRANSITIONS[from].includes(to);
}

export function assertOrderTransition(from: OrderState, to: OrderState): void {
  if (!canTransitionOrder(from, to)) {
    throw new AppError(ERROR_CODES.INVALID_ORDER_STATE, {
      message: `Order cannot move from ${from} to ${to}`,
    });
  }
}

export function canTransitionPayment(from: PaymentState, to: PaymentState): boolean {
  return PAYMENT_TRANSITIONS[from].includes(to);
}

export function assertPaymentTransition(from: PaymentState, to: PaymentState): void {
  if (!canTransitionPayment(from, to)) {
    throw new AppError(ERROR_CODES.PAYMENT_STATE_INVALID, {
      message: `Payment cannot move from ${from} to ${to}`,
    });
  }
}

/** Order states in which the kitchen may see the ticket (POS → KDS contract). */
export const KDS_VISIBLE_STATES: readonly OrderState[] = ["placed", "accepted", "preparing", "ready"];

/** States that are terminal — no further business transitions. */
export const TERMINAL_ORDER_STATES: readonly OrderState[] = ["cancelled", "refunded"];

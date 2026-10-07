/**
 * KDS ticket state machine (Phase A3) — deterministic kitchen actions
 * mapped onto the order aggregate. Kitchen may only advance through
 * the prep pipeline; cancellation propagates from POS (derived state).
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import type { OrderState } from "@/domain/shared/ports";

export type KdsAction = "accept" | "start_prep" | "mark_ready" | "complete";

/** Kitchen-visible order state → allowed kitchen actions. */
export const KDS_ACTION_BY_STATE: Readonly<Record<OrderState, readonly KdsAction[]>> = {
  draft: [],
  placed: ["accept", "start_prep"],
  accepted: ["start_prep"],
  preparing: ["mark_ready"],
  ready: ["complete"],
  completed: [],
  cancelled: [], // POS cancellation propagates automatically (ticket disappears)
  refund_requested: [],
  refunded: [],
};

const ACTION_TARGET: Record<KdsAction, OrderState> = {
  accept: "accepted",
  start_prep: "preparing",
  mark_ready: "ready",
  complete: "completed",
};

export function kdsTargetState(action: KdsAction): OrderState {
  return ACTION_TARGET[action];
}

export function canPerformKdsAction(state: OrderState, action: KdsAction): boolean {
  return KDS_ACTION_BY_STATE[state].includes(action);
}

export function assertKdsAction(state: OrderState, action: KdsAction): void {
  if (!canPerformKdsAction(state, action)) {
    throw new AppError(ERROR_CODES.INVALID_TICKET_TRANSITION, {
      message: `Action "${action}" is not allowed in state ${state}`,
    });
  }
}

/** Item-level preparation status machine. */
export type PrepStatus = "pending" | "preparing" | "ready";

export const PREP_TRANSITIONS: Readonly<Record<PrepStatus, readonly PrepStatus[]>> = {
  pending: ["preparing"],
  preparing: ["ready"],
  ready: [],
};

export function canTransitionPrep(from: PrepStatus, to: PrepStatus): boolean {
  return PREP_TRANSITIONS[from].includes(to);
}

export function assertPrepTransition(from: PrepStatus, to: PrepStatus): void {
  if (!canTransitionPrep(from, to)) {
    throw new AppError(ERROR_CODES.INVALID_TICKET_TRANSITION, {
      message: `Item cannot move from ${from} to ${to}`,
    });
  }
}

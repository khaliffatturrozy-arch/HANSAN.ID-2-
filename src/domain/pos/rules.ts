/**
 * POS business rules (Phase A2) — pure predicates returning AppError
 * results. No I/O. Enforced by PosService before any persistence.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { OrderRecord, OrderType } from "@/domain/shared/ports";

export interface OrderTypeContext {
  tableId: string | null;
  customerId: string | null;
}

/** Dine-in requires a table; online requires a customer; take-away optional customer. */
export function validateOrderAssociations(type: OrderType, ctx: OrderTypeContext): Result<true, AppError> {
  if (type === "dine-in" && !ctx.tableId) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Dine-in orders require a table" }));
  }
  if (type === "online" && !ctx.customerId) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Online orders require a customer" }));
  }
  return ok(true);
}

/**
 * Cancellation policy:
 * - unpaid orders in draft/placed/accepted/preparing may be cancelled;
 * - PAID orders must use the refund flow (money already moved);
 * - ready/completed/refund states are not cancellable.
 */
export function canCancelOrder(order: OrderRecord): Result<true, AppError> {
  if (order.paymentState === "paid" || order.paymentState === "refunding" || order.paymentState === "refunded") {
    return err(new AppError(ERROR_CODES.CANCELLATION_NOT_ALLOWED, {
      message: "Paid orders cannot be cancelled — use the refund workflow",
    }));
  }
  const cancellable = ["draft", "placed", "accepted", "preparing"];
  if (!cancellable.includes(order.state)) {
    return err(new AppError(ERROR_CODES.CANCELLATION_NOT_ALLOWED, {
      message: `Order state ${order.state} cannot be cancelled`,
    }));
  }
  return ok(true);
}

export interface RefundPolicy {
  /** Max hours after completion when a refund is still allowed. */
  windowHours: number;
}

export const DEFAULT_REFUND_POLICY: RefundPolicy = { windowHours: 24 };

/** Refund eligibility: completed + paid + within policy window. */
export function isRefundEligible(
  order: OrderRecord,
  now: Date,
  policy: RefundPolicy = DEFAULT_REFUND_POLICY,
): Result<true, AppError> {
  if (order.state !== "completed") {
    return err(new AppError(ERROR_CODES.REFUND_NOT_ELIGIBLE, { message: "Only completed orders can be refunded" }));
  }
  if (order.paymentState !== "paid") {
    return err(new AppError(ERROR_CODES.REFUND_NOT_ELIGIBLE, { message: "Only paid orders can be refunded" }));
  }
  const completedAt = Date.parse(order.updatedAt);
  if (!Number.isFinite(completedAt)) {
    return err(new AppError(ERROR_CODES.REFUND_NOT_ELIGIBLE, { message: "Order has no valid completion timestamp" }));
  }
  const ageHours = (now.getTime() - completedAt) / 3_600_000;
  if (ageHours > policy.windowHours) {
    return err(new AppError(ERROR_CODES.REFUND_NOT_ELIGIBLE, {
      message: `Refund window of ${policy.windowHours}h has passed`,
    }));
  }
  return ok(true);
}

/** Payment capture requires a placed (or later, unsettled) order. */
export function canCapturePayment(order: OrderRecord): Result<true, AppError> {
  if (order.paymentState !== "unpaid") {
    return err(new AppError(ERROR_CODES.PAYMENT_STATE_INVALID, { message: "Order is not awaiting payment" }));
  }
  if (order.state === "cancelled" || order.state === "refunded" || order.state === "refund_requested") {
    return err(new AppError(ERROR_CODES.INVALID_ORDER_STATE, { message: "Order is not payable" }));
  }
  if (order.state === "draft") {
    return err(new AppError(ERROR_CODES.INVALID_ORDER_STATE, { message: "Place the order before payment" }));
  }
  return ok(true);
}

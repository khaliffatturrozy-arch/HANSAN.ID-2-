/**
 * Finance rules (Phase A5) — refund policy, approvals, reconciliation,
 * tax config. Enforced server-side; never by UI hiding alone.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { RefundRecord } from "@/domain/finance/ports";

/**
 * Roles permitted to APPROVE refunds: business back-office only.
 * The developer/platform role is deliberately EXCLUDED (platform ≠
 * business authority). POS may request but never approve.
 */
export const REFUND_APPROVER_ROLES = ["owner", "finance"] as const;
export type RefundApproverRole = (typeof REFUND_APPROVER_ROLES)[number];

export function isRefundApprover(role: string): role is RefundApproverRole {
  return (REFUND_APPROVER_ROLES as readonly string[]).includes(role);
}

/** Initial refund implementation is CASH ONLY (explicit requirement). */
export const REFUND_METHODS = ["cash"] as const;
export type RefundMethod = (typeof REFUND_METHODS)[number];

export function validateRefundMethod(method: string): Result<RefundMethod, AppError> {
  return (REFUND_METHODS as readonly string[]).includes(method)
    ? ok(method as RefundMethod)
    : err(new AppError(ERROR_CODES.REFUND_NOT_CASH, { message: "Only cash refunds are supported initially" }));
}

/**
 * Separation of duties: the approver must be a different person than
 * the requester (cashier cannot self-approve their own refund).
 */
export function canDecideRefund(params: {
  refund: RefundRecord;
  actorId: string;
  actorRole: string;
}): Result<true, AppError> {
  if (params.refund.status !== "pending") {
    return err(new AppError(ERROR_CODES.REFUND_ALREADY_DECIDED, {
      message: `Refund already ${params.refund.status}`,
    }));
  }
  if (!isRefundApprover(params.actorRole)) {
    return err(new AppError(ERROR_CODES.REFUND_APPROVAL_REQUIRED, {
      message: "Refund approval requires Manager or Back Office (owner/finance)",
    }));
  }
  if (params.actorId === params.refund.requestedBy) {
    return err(new AppError(ERROR_CODES.REFUND_SELF_APPROVAL_FORBIDDEN, {
      message: "Separation of duties: you cannot approve your own refund request",
    }));
  }
  return ok(true);
}

export const REFUND_TRANSITIONS: Readonly<Record<RefundRecord["status"], readonly RefundRecord["status"][]>> = {
  pending: ["approved", "rejected"],
  approved: ["completed"],
  rejected: [],
  completed: [],
};

export function canTransitionRefund(from: RefundRecord["status"], to: RefundRecord["status"]): boolean {
  return REFUND_TRANSITIONS[from].includes(to);
}

// ---------- tax configuration ----------
export interface TaxSettings {
  percent: number;
  label: string;
  inclusive: boolean;
}

export const DEFAULT_TAX: TaxSettings = { percent: 0, label: "Tax", inclusive: false };

export function validateTaxSettings(tax: TaxSettings): Result<true, AppError> {
  if (!Number.isFinite(tax.percent) || tax.percent < 0 || tax.percent > 100) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Tax percent must be 0–100" }));
  }
  if (!tax.label.trim()) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Tax label required" }));
  }
  return ok(true);
}

// ---------- reconciliation ----------
export interface CashSession {
  openingFloatIdr: number;
  cashSalesIdr: number;
  cashRefundsIdr: number;
  cashExpensesIdr: number;
}

export interface CashReconciliation {
  expectedCashIdr: number;
  countedCashIdr: number | null;
  varianceIdr: number | null;
  balanced: boolean | null;
}

/**
 * expected = opening + cash sales − cash refunds − cash expenses.
 * counted supplied by operator; variance null until counted.
 */
export function reconcileCash(session: CashSession, countedCashIdr: number | null): CashReconciliation {
  const expected =
    session.openingFloatIdr + session.cashSalesIdr - session.cashRefundsIdr - session.cashExpensesIdr;
  if (countedCashIdr === null) {
    return { expectedCashIdr: expected, countedCashIdr: null, varianceIdr: null, balanced: null };
  }
  const variance = countedCashIdr - expected;
  return { expectedCashIdr: expected, countedCashIdr, varianceIdr: variance, balanced: variance === 0 };
}

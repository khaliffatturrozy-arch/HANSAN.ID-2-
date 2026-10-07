/**
 * FinanceService (Phase A5) — expense recording, refund workflow
 * (request → approve/reject → complete, cash-only, separation of
 * duties), and summary reporting from real records.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { createId } from "@/domain/shared/ids";
import { AUDIT_ACTIONS, type AuditLogPort } from "@/domain/audit/events";
import type { FinancePort, ExpenseRecord, RefundRecord } from "@/domain/finance/ports";
import type { OrderPort, UserRecord } from "@/domain/shared/ports";
import { canDecideRefund, canTransitionRefund, validateRefundMethod } from "@/domain/finance/rules";
import { summarizeFinancials, type FinancialSummary } from "@/domain/finance/reporting";

export interface FinanceServiceDeps {
  finance: FinancePort;
  orders: OrderPort;
  audit: AuditLogPort;
  clock: () => Date;
}

export class FinanceService {
  constructor(private readonly deps: FinanceServiceDeps) {}

  async recordExpense(params: {
    actor: UserRecord;
    tenantId: string;
    outletId: string;
    category: string;
    description: string;
    amountIdr: number;
    incurredAtIso: string;
  }): Promise<ExpenseRecord> {
    const { actor, tenantId, outletId, category, description, amountIdr, incurredAtIso } = params;
    if (!Number.isInteger(amountIdr) || amountIdr <= 0) {
      throw new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Expense must be a positive integer amount" });
    }
    const expense: ExpenseRecord = {
      id: createId("exp"),
      tenantId,
      outletId,
      category: category.trim(),
      description: description.trim(),
      amountIdr,
      incurredAt: incurredAtIso,
      createdBy: actor.id,
    };
    await this.deps.finance.saveExpense(expense);
    return expense;
  }

  /** POS-side refund request: validates order + cash method + persists. */
  async requestRefund(params: {
    tenantId: string;
    outletId: string;
    orderId: string;
    amountIdr: number;
    reason: string;
    requester: UserRecord;
  }): Promise<RefundRecord> {
    const method = validateRefundMethod("cash");
    if (!method.ok) throw method.error;
    if (!Number.isInteger(params.amountIdr) || params.amountIdr <= 0) {
      throw new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Refund amount must be a positive integer" });
    }
    const order = await this.deps.orders.findById(params.orderId);
    if (!order || order.tenantId !== params.tenantId) {
      throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Order not found" });
    }
    const refund: RefundRecord = {
      id: createId("ref"),
      tenantId: params.tenantId,
      outletId: params.outletId,
      orderId: params.orderId,
      amountIdr: params.amountIdr,
      method: "cash",
      reason: params.reason,
      status: "pending",
      requestedBy: params.requester.id,
      createdAt: this.deps.clock().toISOString(),
    };
    await this.deps.finance.saveRefund(refund);
    await this.deps.audit.record({
      id: createId("aud"),
      action: AUDIT_ACTIONS.REFUND_REQUESTED,
      actorId: params.requester.id,
      actorRole: "system",
      entityType: "refund",
      entityId: refund.id,
      tenantId: refund.tenantId,
      outletId: refund.outletId,
      occurredAt: refund.createdAt,
      metadata: { amountIdr: refund.amountIdr, orderId: refund.orderId },
    });
    return refund;
  }

  /** Approve/reject: Manager/Back-Office only + separation of duties. */
  async decideRefund(refundId: string, decision: "approved" | "rejected", actor: UserRecord): Promise<RefundRecord> {
    const refund = await this.deps.finance.getRefund(refundId);
    if (!refund) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Refund not found" });
    const allowed = canDecideRefund({ refund, actorId: actor.id, actorRole: actor.role });
    if (!allowed.ok) throw allowed.error;
    if (!canTransitionRefund(refund.status, decision)) {
      throw new AppError(ERROR_CODES.REFUND_ALREADY_DECIDED);
    }
    const decidedAt = this.deps.clock().toISOString();
    const updated: RefundRecord = { ...refund, status: decision, decidedBy: actor.id, decidedAt };
    await this.deps.finance.saveRefund(updated);
    await this.deps.audit.record({
      id: createId("aud"),
      action: decision === "approved" ? AUDIT_ACTIONS.REFUND_APPROVED : AUDIT_ACTIONS.REFUND_REJECTED,
      actorId: actor.id,
      actorRole: "system",
      entityType: "refund",
      entityId: refund.id,
      tenantId: refund.tenantId,
      outletId: refund.outletId,
      occurredAt: decidedAt,
      metadata: { amountIdr: refund.amountIdr },
    });
    return updated;
  }

  /** Complete an approved cash refund (executes the payout). */
  async completeRefund(refundId: string, actor: UserRecord): Promise<RefundRecord> {
    const refund = await this.deps.finance.getRefund(refundId);
    if (!refund) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Refund not found" });
    if (!canTransitionRefund(refund.status, "completed")) {
      throw new AppError(ERROR_CODES.REFUND_ALREADY_DECIDED, {
        message: `Cannot complete a ${refund.status} refund`,
      });
    }
    const method = validateRefundMethod(refund.method);
    if (!method.ok) throw method.error;
    const updated: RefundRecord = { ...refund, status: "completed" };
    await this.deps.finance.saveRefund(updated);
    await this.deps.audit.record({
      id: createId("aud"),
      action: AUDIT_ACTIONS.REFUND_COMPLETED,
      actorId: actor.id,
      actorRole: "system",
      entityType: "refund",
      entityId: refund.id,
      tenantId: refund.tenantId,
      outletId: refund.outletId,
      occurredAt: this.deps.clock().toISOString(),
      metadata: { amountIdr: refund.amountIdr },
    });
    return updated;
  }

  /** Summary from REAL records (empty database ⇒ zeros, §4). */
  async summary(tenantId: string, sinceIso?: string): Promise<FinancialSummary> {
    const orders = await this.deps.orders.listByTenant(tenantId, {
      limit: 200,
      ...(sinceIso ? { sinceIso } : {}),
    });
    const paid = orders.filter(
      (o) => o.paymentState === "paid" || o.paymentState === "refunding",
    );
    const expenses = await this.deps.finance.listExpenses(tenantId, sinceIso);
    const refunds = await this.deps.finance.listRefunds(tenantId);
    return summarizeFinancials({
      paidOrders: paid.map((o) => ({
        grandTotalIdr: o.grandTotalIdr,
        taxIdr: o.taxIdr,
        discountIdr: o.discountIdr,
      })),
      expenses: expenses.map((e) => ({ amountIdr: e.amountIdr, category: e.category })),
      completedRefunds: refunds.filter((r) => r.status === "completed").map((r) => ({ amountIdr: r.amountIdr })),
    });
  }
}
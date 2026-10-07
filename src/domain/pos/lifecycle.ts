/**
 * Order lifecycle operations (Phase A2) — state transitions, payment
 * capture, cancellation, refund requests. Pure orchestration over
 * ports; audit emitted for every security-relevant action.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { createId } from "@/domain/shared/ids";
import { AUDIT_ACTIONS, type AuditEvent, type AuditLogPort } from "@/domain/audit/events";
import type { OrderPort, OrderRecord, OrderState } from "@/domain/shared/ports";
import { assertOrderTransition, assertPaymentTransition } from "@/domain/pos/order-state";
import {
  canCancelOrder,
  canCapturePayment,
  isRefundEligible,
  DEFAULT_REFUND_POLICY,
  type RefundPolicy,
} from "@/domain/pos/rules";

export interface LifecycleDeps {
  orders: OrderPort;
  audit: AuditLogPort;
  clock: () => Date;
}

export async function requireOrder(orders: OrderPort, orderId: string): Promise<OrderRecord> {
  const order = await orders.findById(orderId);
  if (!order) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Order not found" });
  return order;
}

async function audit(
  auditPort: AuditLogPort,
  event: Omit<AuditEvent, "id">,
): Promise<void> {
  await auditPort.record({ ...event, id: createId("aud") });
}

export async function transitionOrder(
  deps: LifecycleDeps,
  orderId: string,
  to: OrderState,
  actorId: string,
): Promise<OrderRecord> {
  const order = await requireOrder(deps.orders, orderId);
  assertOrderTransition(order.state, to);
  const updated: OrderRecord = { ...order, state: to, updatedAt: deps.clock().toISOString() };
  await deps.orders.save(updated);
  if (to === "cancelled") {
    await audit(deps.audit, {
      action: AUDIT_ACTIONS.ORDER_CANCELLED,
      actorId,
      actorRole: "system",
      entityType: "order",
      entityId: order.id,
      tenantId: order.tenantId,
      outletId: order.outletId,
      occurredAt: updated.updatedAt,
      metadata: { previousState: order.state },
    });
  }
  return updated;
}

export async function capturePayment(
  deps: LifecycleDeps,
  orderId: string,
  actorId: string,
): Promise<OrderRecord> {
  const order = await requireOrder(deps.orders, orderId);
  const allowed = canCapturePayment(order);
  if (!allowed.ok) throw allowed.error;
  assertPaymentTransition(order.paymentState, "paid");
  const now = deps.clock().toISOString();
  const updated: OrderRecord = { ...order, paymentState: "paid", updatedAt: now };
  await deps.orders.save(updated);
  await audit(deps.audit, {
    action: AUDIT_ACTIONS.PAYMENT_CAPTURED,
    actorId,
    actorRole: "system",
    entityType: "order",
    entityId: order.id,
    tenantId: order.tenantId,
    outletId: order.outletId,
    occurredAt: now,
    metadata: { amountIdr: order.grandTotalIdr },
  });
  return updated;
}

export async function cancelOrder(
  deps: LifecycleDeps,
  orderId: string,
  actorId: string,
): Promise<OrderRecord> {
  const order = await requireOrder(deps.orders, orderId);
  const allowed = canCancelOrder(order);
  if (!allowed.ok) throw allowed.error;
  assertOrderTransition(order.state, "cancelled");
  const now = deps.clock().toISOString();
  const updated: OrderRecord = { ...order, state: "cancelled", updatedAt: now };
  await deps.orders.save(updated);
  await audit(deps.audit, {
    action: AUDIT_ACTIONS.ORDER_CANCELLED,
    actorId,
    actorRole: "system",
    entityType: "order",
    entityId: order.id,
    tenantId: order.tenantId,
    outletId: order.outletId,
    occurredAt: now,
    metadata: { previousState: order.state },
  });
  return updated;
}

export async function requestRefund(
  deps: LifecycleDeps,
  orderId: string,
  actorId: string,
  policy: RefundPolicy = DEFAULT_REFUND_POLICY,
): Promise<OrderRecord> {
  const order = await requireOrder(deps.orders, orderId);
  const eligible = isRefundEligible(order, deps.clock(), policy);
  if (!eligible.ok) throw eligible.error;
  assertOrderTransition(order.state, "refund_requested");
  const now = deps.clock().toISOString();
  const updated: OrderRecord = { ...order, state: "refund_requested", paymentState: "refunding", updatedAt: now };
  await deps.orders.save(updated);
  await audit(deps.audit, {
    action: AUDIT_ACTIONS.REFUND_REQUESTED,
    actorId,
    actorRole: "system",
    entityType: "order",
    entityId: order.id,
    tenantId: order.tenantId,
    outletId: order.outletId,
    occurredAt: now,
    metadata: { amountIdr: order.grandTotalIdr },
  });
  return updated;
}

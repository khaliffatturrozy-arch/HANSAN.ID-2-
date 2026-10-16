/**
 * Refund decision/complete API (OA14) — Manager/Back-Office approval and
 * completion of a pending/approved refund.
 *
 * Request lifecycle:
 *   1. assertSameOrigin   — CSRF second layer.
 *   2. requireAuth        — fail-closed identity (401/503).
 *   3. authorize          — RBAC: `finance:refund_approve` for approve/reject,
 *      `finance:refund_complete` for complete (403 + audit).
 *   4. Tenant/outlet scope — refund's tenantId/outletId must match the actor's
 *      authoritative session scope (cross-tenant → 404, non-leaking).
 *   5. FinanceService.decideRefund / completeRefund — atomic conditional
 *      transition via `transitionRefund`; concurrent modification → 409 CONFLICT.
 *   6. Persist decided/completed Refund + audit event.
 *
 * Client-supplied roles and tenant IDs are never trusted: authorization is
 * server-side from the session, and the refund record's own tenantId is the
 * source of truth for scope enforcement.
 */
import { jsonError, jsonFail, jsonOk } from "@/server/http";
import { requireAuth, authorize, assertSameOrigin, type AuthContext } from "@/server/authz";
import { runtimeFor } from "@/server/runtime";
import { FinanceService } from "@/domain/finance/service";
import { ERROR_CODES } from "@/domain/shared/errors";
import type { UserRecord } from "@/domain/shared/ports";

function actorToUser(ctx: AuthContext): UserRecord {
  return {
    id: ctx.session.sub,
    email: ctx.session.email,
    displayName: ctx.session.email,
    role: ctx.session.role,
    tenantId: ctx.session.tenantId,
    outletIds: ctx.session.outletIds,
    active: true,
    createdAt: new Date(ctx.session.iat * 1000).toISOString(),
  };
}

function serviceFor(runtime: NonNullable<Awaited<ReturnType<typeof runtimeFor>>>): FinanceService {
  return new FinanceService({
    finance: runtime.finance,
    orders: runtime.orders,
    audit: runtime.audit,
    clock: () => new Date(),
  });
}

interface RefundDecisionBody {
  action: "approve" | "reject" | "complete";
}

function getRefundId(req: Request): string | null {
  const match = req.url.match(/^.*\/api\/refunds\/([^\/]+)\/?/);
  return match ? match[1] : null;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    assertSameOrigin(req);
    const ctx = await requireAuth(req);

    const runtime = runtimeFor(ctx.session);
    if (!runtime) {
      return jsonFail(
        ERROR_CODES.PERSISTENCE_NOT_CONFIGURED,
        "Refund decisions are not configured on this deployment",
        503,
      );
    }

    const refundId = getRefundId(req);
    if (!refundId) {
      return jsonFail(ERROR_CODES.VALIDATION_FAILED, "Refund ID is required", 400);
    }

    const body = (await req.json().catch(() => null)) as unknown;
    if (!body || typeof body !== "object") {
      return jsonFail(ERROR_CODES.VALIDATION_FAILED, "Invalid refund decision", 400);
    }
    const { action } = body as RefundDecisionBody;
    if (action !== "approve" && action !== "reject" && action !== "complete") {
      return jsonFail(
        ERROR_CODES.VALIDATION_FAILED,
        "action must be 'approve', 'reject', or 'complete'",
        400,
      );
    }

    const actor = actorToUser(ctx);
    const finance = serviceFor(runtime);

    // Load the refund to verify tenant scope before authorizing.
    const refund = await runtime.finance.getRefund(refundId, ctx.session.tenantId);
    if (!refund) {
      return jsonFail(ERROR_CODES.NOT_FOUND, "Refund not found", 404);
    }
    // Cross-tenant access is denied as NOT_FOUND (no existence leak).
    if (refund.tenantId !== ctx.session.tenantId) {
      return jsonFail(ERROR_CODES.NOT_FOUND, "Refund not found", 404);
    }
    // Outlet scope: owner/finance may access any outlet; others limited to granted outlets.
    if (ctx.session.role !== "owner" && ctx.session.role !== "finance") {
      if (!ctx.session.outletIds.includes(refund.outletId)) {
        return jsonFail(ERROR_CODES.OUTLET_MISMATCH, "Outlet access denied", 403);
      }
    }

    let result: Awaited<ReturnType<typeof finance.decideRefund>>;

    if (action === "approve" || action === "reject") {
      authorize(ctx, "finance:refund_approve", runtime.audit);
      const decision = action === "approve" ? "approved" : "rejected";
      result = await finance.decideRefund(refundId, decision, actor);
    } else {
      // action === "complete"
      authorize(ctx, "finance:refund_complete", runtime.audit);
      result = await finance.completeRefund(refundId, actor);
    }

    return jsonOk({
      id: result.id,
      status: result.status,
      amountIdr: result.amountIdr,
      orderId: result.orderId,
      tenantId: result.tenantId,
      outletId: result.outletId,
      decidedBy: result.decidedBy,
      decidedAt: result.decidedAt,
      createdAt: result.createdAt,
    });
  } catch (error) {
    return jsonError(error);
  }
}
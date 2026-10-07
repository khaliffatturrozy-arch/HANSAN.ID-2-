/**
 * InventoryService (Phase A4) — receive, adjust, opname, waste, and
 * recipe deduction. Every multi-row change runs inside the injected
 * TransactionBoundary; policy validated BEFORE the transaction and the
 * adapter re-verifies via expectedFinalQuantity (race guard).
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { createId } from "@/domain/shared/ids";
import { AUDIT_ACTIONS, type AuditAction, type AuditLogPort } from "@/domain/audit/events";
import type {
  InventoryPort,
  StockMaterialRecord,
  StockMovementType,
  PurchasingPort,
  PurchaseOrderRecord,
} from "@/domain/inventory/ports";
import {
  applyStockChange,
  validateBatch,
  type StockPolicy,
  DEFAULT_STOCK_POLICY,
} from "@/domain/inventory/stock";
import { buildDeductionPlan, computableProducible, type Recipe } from "@/domain/inventory/recipes";

/** Transaction boundary — DB adapter supplies real transactions. */
export interface TransactionBoundary {
  run<T>(fn: () => Promise<T>): Promise<T>;
}

export interface InventoryServiceDeps {
  inventory: InventoryPort;
  purchasing: PurchasingPort;
  audit: AuditLogPort;
  clock: () => Date;
  tx: TransactionBoundary;
  policy?: StockPolicy;
}

async function move(
  deps: InventoryServiceDeps,
  materialId: string,
  type: StockMovementType,
  delta: number,
  reason: string,
  actorId: string,
): Promise<void> {
  const material = await deps.inventory.getMaterial(materialId);
  if (!material) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Material not found" });
  const next = applyStockChange(material.quantity, delta, deps.policy ?? DEFAULT_STOCK_POLICY);
  if (!next.ok) throw next.error;
  await deps.inventory.applyMovement(
    {
      id: createId("mov"),
      materialId,
      type,
      quantityDelta: delta,
      reason,
      actorId,
      occurredAt: deps.clock().toISOString(),
    },
    next.value,
  );
}

export class InventoryService {
  constructor(private readonly deps: InventoryServiceDeps) {}

  /** PO receive: status check + stock receipt per line (atomic). */
  async receivePurchaseOrder(poId: string, actorId: string): Promise<PurchaseOrderRecord> {
    const po = await this.deps.purchasing.getPurchaseOrder(poId);
    if (!po) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Purchase order not found" });
    if (po.status !== "sent") {
      throw new AppError(ERROR_CODES.CONFLICT, { message: `Cannot receive a ${po.status} purchase order` });
    }
    await this.deps.tx.run(async () => {
      for (const line of po.lines) {
        await move(this.deps, line.materialId, "purchase_receipt", line.quantity, `PO ${po.id}`, actorId);
      }
      await this.deps.purchasing.savePurchaseOrder({ ...po, status: "received" });
    });
    await this.recordAudit(AUDIT_ACTIONS.PURCHASE_RECEIVED, po.id, actorId, { lines: po.lines.length });
    return { ...po, status: "received" };
  }

  async adjust(materialId: string, delta: number, reason: string, actorId: string): Promise<void> {
    await this.deps.tx.run(() => move(this.deps, materialId, "adjustment", delta, reason, actorId));
    await this.recordAudit(AUDIT_ACTIONS.STOCK_ADJUSTED, materialId, actorId, { delta, reason });
  }

  async recordWaste(materialId: string, quantity: number, reason: string, actorId: string): Promise<void> {
    if (!(quantity > 0)) throw new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Waste must be > 0" });
    await this.deps.tx.run(() => move(this.deps, materialId, "waste", -quantity, reason, actorId));
    await this.recordAudit(AUDIT_ACTIONS.STOCK_WASTE, materialId, actorId, { quantity, reason });
  }

  /** Stock opname: delta = counted − current (atomic read+write in tx). */
  async opname(materialId: string, countedQuantity: number, actorId: string): Promise<void> {
    await this.deps.tx.run(async () => {
      const material = await this.deps.inventory.getMaterial(materialId);
      if (!material) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Material not found" });
      const delta = Math.round((countedQuantity - material.quantity) * 1e6) / 1e6;
      if (delta !== 0) {
        await move(this.deps, materialId, "opname", delta, `Opname count: ${countedQuantity}`, actorId);
      }
    });
    await this.recordAudit(AUDIT_ACTIONS.STOCK_OPNAME, materialId, actorId, { countedQuantity });
  }

  /** Validate the whole batch, then deduct recipe ingredients atomically. */
  async deductForProduction(recipe: Recipe, portions: number, actorId: string): Promise<void> {
    const materials = await this.deps.inventory.listMaterials(recipe.tenantId);
    const plan = buildDeductionPlan(recipe, portions, materials);
    if (!plan.ok) throw plan.error;
    const entries = plan.value.map((line) => ({
      currentQuantity: materials.find((m) => m.id === line.materialId)?.quantity ?? 0,
      delta: line.delta,
    }));
    const batch = validateBatch(entries, this.deps.policy ?? DEFAULT_STOCK_POLICY);
    if (!batch.ok) throw batch.error;
    await this.deps.tx.run(async () => {
      for (const line of plan.value) {
        await move(this.deps, line.materialId, "recipe_deduction", line.delta, `Recipe ${recipe.id} x${portions}`, actorId);
      }
    });
  }

  producible(recipe: Recipe, materials: StockMaterialRecord[]) {
    return computableProducible(recipe, materials);
  }

  private async recordAudit(
    action: AuditAction,
    entityId: string,
    actorId: string,
    metadata: Record<string, string | number | boolean>,
  ): Promise<void> {
    await this.deps.audit.record({
      id: createId("aud"),
      action,
      actorId,
      actorRole: "system",
      entityType: "material",
      entityId,
      occurredAt: this.deps.clock().toISOString(),
      metadata,
    });
  }
}
/** Inventory + purchasing repository ports (Phase A4). */

export type UnitCode = "g" | "kg" | "ml" | "l" | "pc";

export interface StockMaterialRecord {
  id: string;
  tenantId: string;
  name: string;
  unit: UnitCode;
  quantity: number;
  lowStockThreshold: number;
  expiryDate: string | null;
  updatedAt: string;
}

export type StockMovementType =
  | "purchase_receipt"
  | "recipe_deduction"
  | "adjustment"
  | "opname"
  | "waste"
  | "return";

export interface StockMovementRecord {
  id: string;
  materialId: string;
  type: StockMovementType;
  quantityDelta: number;
  quantityAfter: number;
  reason: string;
  actorId: string;
  occurredAt: string;
}

export interface InventoryPort {
  getMaterial(id: string): Promise<StockMaterialRecord | null>;
  listMaterials(tenantId: string): Promise<StockMaterialRecord[]>;
  /**
   * Atomically apply quantity delta + persist movement.
   * Adapter MUST be transactional and verify quantityAfter matches the
   * row it wrote — prevents lost updates under concurrency. Domain
   * validates policy first; adapter guards races.
   */
  applyMovement(
    movement: Omit<StockMovementRecord, "quantityAfter">,
    expectedFinalQuantity: number,
  ): Promise<StockMovementRecord>;
  listMovements(materialId: string): Promise<StockMovementRecord[]>;
}

export interface SupplierRecord {
  id: string;
  tenantId: string;
  name: string;
  contact: string | null;
  active: boolean;
}

export interface PurchaseOrderRecord {
  id: string;
  tenantId: string;
  supplierId: string;
  lines: { materialId: string; quantity: number; unitPriceIdr: number }[];
  status: "draft" | "sent" | "received" | "cancelled";
  createdBy: string;
  createdAt: string;
}

export interface PurchasingPort {
  getSupplier(id: string): Promise<SupplierRecord | null>;
  getPurchaseOrder(id: string): Promise<PurchaseOrderRecord | null>;
  savePurchaseOrder(po: PurchaseOrderRecord): Promise<void>;
  listPurchaseOrders(tenantId: string): Promise<PurchaseOrderRecord[]>;
}

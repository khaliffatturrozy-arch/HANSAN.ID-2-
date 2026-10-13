/**
 * Process-local in-memory repositories for the DEMO SANDBOX (Phase 4).
 *
 * SERVER-ONLY. These back demo sessions so demo data can physically never
 * reach Postgres / production business tables. They start EMPTY (no
 * fabricated records) and reset when the process restarts — a safe, honest
 * demo surface that satisfies "demo data cannot mutate production records".
 */
import type { CatalogPort, OrderPort, OrderRecord, PaymentPort, PaymentRecord, ProductRecord } from "@/domain/shared/ports";

export class MemoryOrders implements OrderPort {
  rows = new Map<string, OrderRecord>();
  private counters = new Map<string, number>();

  // Phase 12: scope is REQUIRED and enforced, mirroring the Prisma adapter —
  // there is no unscoped read, so demo/test flows exercise the same contract.
  async findById(id: string, scope: { organizationId: string; outletId?: string }): Promise<OrderRecord | null> {
    const row = this.rows.get(id) ?? null;
    if (!row) return null;
    if (row.tenantId !== scope.organizationId) return null;
    if (scope.outletId && row.outletId !== scope.outletId) return null;
    return row;
  }
  async save(order: OrderRecord): Promise<void> {
    this.rows.set(order.id, { ...order, lines: order.lines.map((l) => ({ ...l })) });
  }
  async listByOutlet(outletId: string, options?: { limit?: number; sinceIso?: string }): Promise<OrderRecord[]> {
    return this.filter((o) => o.outletId === outletId, options);
  }
  async listByTenant(tenantId: string, options?: { limit?: number; sinceIso?: string }): Promise<OrderRecord[]> {
    return this.filter((o) => o.tenantId === tenantId, options);
  }
  async nextOrderNumber(outletId: string): Promise<string> {
    const next = (this.counters.get(outletId) ?? 0) + 1;
    this.counters.set(outletId, next);
    return `ORD-${String(next).padStart(5, "0")}`;
  }
  private filter(
    predicate: (o: OrderRecord) => boolean,
    options?: { limit?: number; sinceIso?: string },
  ): Promise<OrderRecord[]> {
    let rows = Array.from(this.rows.values())
      .filter(predicate)
      .filter((o) => !options?.sinceIso || o.createdAt >= options.sinceIso!)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (options?.limit) rows = rows.slice(0, options.limit);
    return Promise.resolve(rows.map((o) => ({ ...o, lines: o.lines.map((l) => ({ ...l })) })));
  }
}

export class MemoryCatalog implements CatalogPort {
  rows = new Map<string, ProductRecord>();
  // Phase 12: scope is REQUIRED and enforced, mirroring the Prisma adapter.
  async findById(id: string, scope: { organizationId: string }): Promise<ProductRecord | null> {
    const row = this.rows.get(id) ?? null;
    if (!row) return null;
    if (row.tenantId !== scope.organizationId) return null;
    return row;
  }
  async listActive(tenantId: string): Promise<ProductRecord[]> {
    return Array.from(this.rows.values()).filter((p) => p.tenantId === tenantId && p.active);
  }
  /** Sandbox-only insert (used by the demo catalog seeder). */
  put(product: ProductRecord): void {
    this.rows.set(product.id, product);
  }
}

/**
 * In-memory PaymentPort for the DEMO SANDBOX and tests. Like the other memory
 * stores it starts EMPTY and never fabricates rows: a payment exists only when
 * capturePayment wrote it. Demo payments physically never reach Postgres.
 */
export class MemoryPayments implements PaymentPort {
  rows = new Map<string, PaymentRecord>();

  async save(payment: PaymentRecord): Promise<void> {
    this.rows.set(payment.id, { ...payment });
  }
  // Scoped path mirrors PrismaPayments: cross-tenant order ids yield [].
  // MemoryPayments has no parent-order table, so scope is enforced against
  // the payment rows' own tenantId (equivalent: rows of another tenant are
  // invisible to this caller). Phase 12: scope is REQUIRED and enforced.
  async listByOrder(orderId: string, scope: { organizationId: string }): Promise<PaymentRecord[]> {
    return Array.from(this.rows.values())
      .filter((p) => p.orderId === orderId && p.tenantId === scope.organizationId)
      .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  }
  async listByTenant(
    tenantId: string,
    options?: { sinceIso?: string; limit?: number },
  ): Promise<PaymentRecord[]> {
    let rows = Array.from(this.rows.values()).filter(
      (p) => p.tenantId === tenantId && (!options?.sinceIso || p.capturedAt >= options.sinceIso),
    );
    rows = rows.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
    if (options?.limit) rows = rows.slice(0, options.limit);
    return rows.map((p) => ({ ...p }));
  }
}

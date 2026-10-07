/**
 * Analytics aggregations (Phase A8) — pure functions over REAL
 * records. Every function returns structurally valid ZEROS for empty
 * input; nothing is ever fabricated to fill dashboards (§4).
 */
import {
  bucketKey,
  bucketLabels,
  fallsWithin,
  granularityFor,
  type Period,
} from "@/domain/analytics/periods";
import type { OrderRecord } from "@/domain/shared/ports";
import type { StockMaterialRecord } from "@/domain/inventory/ports";
import type { CustomerRecord } from "@/domain/customers/ports";

// ---------- sales ----------
export interface SalesSummary {
  orderCount: number;
  grossIdr: number;
  taxIdr: number;
  discountIdr: number;
  netIdr: number;
  averageOrderIdr: number;
}

export const EMPTY_SALES: SalesSummary = {
  orderCount: 0, grossIdr: 0, taxIdr: 0, discountIdr: 0, netIdr: 0, averageOrderIdr: 0,
};

export function salesSummary(orders: OrderRecord[]): SalesSummary {
  if (orders.length === 0) return EMPTY_SALES;
  const gross = orders.reduce((s, o) => s + o.grandTotalIdr, 0);
  return {
    orderCount: orders.length,
    grossIdr: gross,
    taxIdr: orders.reduce((s, o) => s + o.taxIdr, 0),
    discountIdr: orders.reduce((s, o) => s + o.discountIdr, 0),
    netIdr: gross,
    averageOrderIdr: Math.round(gross / orders.length),
  };
}

export interface SalesPoint {
  bucket: string;
  orderCount: number;
  netIdr: number;
}

/** Time series with ALL buckets present (zero-filled, honest). */
export function salesSeries(orders: OrderRecord[], period: Period): SalesPoint[] {
  const granularity = granularityFor(period);
  const labels = new Map<string, SalesPoint>();
  for (const label of bucketLabels(period, granularity)) {
    labels.set(label, { bucket: label, orderCount: 0, netIdr: 0 });
  }
  for (const order of orders) {
    if (!fallsWithin(period, order.createdAt)) continue;
    const key = bucketKey(order.createdAt, granularity);
    const point = labels.get(key);
    if (point) {
      point.orderCount += 1;
      point.netIdr += order.grandTotalIdr;
    }
  }
  return Array.from(labels.values());
}

// ---------- products ----------
export interface ProductPerformance {
  productId: string;
  productName: string;
  units: number;
  revenueIdr: number;
}

export function productPerformance(orders: OrderRecord[]): ProductPerformance[] {
  const map = new Map<string, ProductPerformance>();
  for (const order of orders) {
    for (const line of order.lines) {
      if (line.state !== "active") continue;
      const entry = map.get(line.productId) ?? {
        productId: line.productId,
        productName: line.productName,
        units: 0,
        revenueIdr: 0,
      };
      entry.units += line.quantity;
      entry.revenueIdr += line.quantity * line.unitPriceIdr;
      map.set(line.productId, entry);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.revenueIdr - a.revenueIdr);
}

// ---------- customers ----------
export interface CustomerAnalytics {
  totalCustomers: number;
  activeInPeriod: number;
  averagePoints: number;
}

export function customerAnalytics(customers: CustomerRecord[], orders: OrderRecord[], period: Period): CustomerAnalytics {
  if (customers.length === 0) return { totalCustomers: 0, activeInPeriod: 0, averagePoints: 0 };
  const buyerIds = new Set(
    orders.filter((o) => fallsWithin(period, o.createdAt) && o.customerId).map((o) => o.customerId as string),
  );
  const points = customers.reduce((s, c) => s + c.loyaltyPoints, 0);
  return {
    totalCustomers: customers.length,
    activeInPeriod: buyerIds.size,
    averagePoints: Math.round(points / customers.length),
  };
}

// ---------- inventory ----------
export interface InventoryAnalytics {
  materialCount: number;
  lowStockCount: number;
  expiringSoonCount: number;
}

export function inventoryAnalytics(materials: StockMaterialRecord[], now: Date): InventoryAnalytics {
  if (materials.length === 0) return { materialCount: 0, lowStockCount: 0, expiringSoonCount: 0 };
  let low = 0;
  let expiring = 0;
  for (const m of materials) {
    if (m.quantity <= m.lowStockThreshold) low += 1;
    if (m.expiryDate) {
      const days = (Date.parse(m.expiryDate) - now.getTime()) / 86_400_000;
      if (days <= 7) expiring += 1;
    }
  }
  return { materialCount: materials.length, lowStockCount: low, expiringSoonCount: expiring };
}

// ---------- operational ----------
export interface OperationalAnalytics {
  byType: { orderType: OrderRecord["orderType"]; count: number }[];
  cancellationRate: number;
  completedCount: number;
}

export function operationalAnalytics(orders: OrderRecord[]): OperationalAnalytics {
  if (orders.length === 0) {
    return { byType: [], cancellationRate: 0, completedCount: 0 };
  }
  const types: Record<OrderRecord["orderType"], number> = { "dine-in": 0, "take-away": 0, online: 0 };
  let cancelled = 0;
  let completed = 0;
  for (const o of orders) {
    types[o.orderType] += 1;
    if (o.state === "cancelled") cancelled += 1;
    if (o.state === "completed" || o.state === "refunded" || o.state === "refund_requested") completed += 1;
  }
  return {
    byType: Object.entries(types).map(([orderType, count]) => ({ orderType: orderType as OrderRecord["orderType"], count })),
    cancellationRate: Number((cancelled / orders.length).toFixed(4)),
    completedCount: completed,
  };
}

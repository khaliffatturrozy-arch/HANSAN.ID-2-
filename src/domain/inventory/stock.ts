/**
 * Stock rules (Phase A4): movement math, negative-stock policy,
 * low-stock and expiry evaluation. Pure — no I/O.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { StockMovementRecord } from "@/domain/inventory/ports";

export interface StockPolicy {
  /** Business rule: reject any movement that would drive stock below zero. */
  allowNegative: boolean;
}

export const DEFAULT_STOCK_POLICY: StockPolicy = { allowNegative: false };

/** Validate + compute the resulting quantity for a movement. */
export function applyStockChange(
  currentQuantity: number,
  delta: number,
  policy: StockPolicy = DEFAULT_STOCK_POLICY,
): Result<number, AppError> {
  if (!Number.isFinite(currentQuantity) || !Number.isFinite(delta)) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Quantities must be finite numbers" }));
  }
  const next = Math.round((currentQuantity + delta) * 1e6) / 1e6;
  if (next < 0 && !policy.allowNegative) {
    return err(new AppError(ERROR_CODES.NEGATIVE_STOCK_FORBIDDEN, {
      message: `Movement would set stock to ${next} (negative stock disallowed)`,
    }));
  }
  return ok(next);
}

export function isLowStock(quantity: number, threshold: number): boolean {
  return quantity <= threshold;
}

export function isExpired(expiryDate: string | null, now: Date): boolean {
  if (!expiryDate) return false;
  const t = Date.parse(expiryDate);
  if (!Number.isFinite(t)) return false;
  return t < now.getTime();
}

export function daysUntilExpiry(expiryDate: string | null, now: Date): number | null {
  if (!expiryDate) return null;
  const t = Date.parse(expiryDate);
  if (!Number.isFinite(t)) return null;
  return Math.ceil((t - now.getTime()) / 86_400_000);
}

/**
 * Validate a batch of movements against the policy BEFORE any is applied
 * (service applies them atomically inside a transaction boundary).
 */
export function validateBatch(
  entries: { currentQuantity: number; delta: number }[],
  policy: StockPolicy = DEFAULT_STOCK_POLICY,
): Result<number[], AppError> {
  const results: number[] = [];
  for (const entry of entries) {
    const next = applyStockChange(entry.currentQuantity, entry.delta, policy);
    if (!next.ok) return next;
    results.push(next.value);
  }
  return ok(results);
}

/** A planned movement (not yet persisted). */
export interface PlannedMovement {
  materialId: string;
  type: StockMovementRecord["type"];
  delta: number;
  reason: string;
}

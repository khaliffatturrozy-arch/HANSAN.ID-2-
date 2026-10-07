/**
 * Units of measure (Phase A4): gram, kilogram, milliliter, liter, piece.
 * Conversions only within the same dimension (mass↔mass, volume↔volume,
 * count↔count). Quantities are JS numbers; results rounded to 6 decimals.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";

export type UnitCode = "g" | "kg" | "ml" | "l" | "pc";

export type Dimension = "mass" | "volume" | "count";

export const UNIT_META: Readonly<Record<UnitCode, { dimension: Dimension; factorToBase: number }>> = {
  g: { dimension: "mass", factorToBase: 1 },
  kg: { dimension: "mass", factorToBase: 1000 },
  ml: { dimension: "volume", factorToBase: 1 },
  l: { dimension: "volume", factorToBase: 1000 },
  pc: { dimension: "count", factorToBase: 1 },
};

export const BASE_UNIT: Readonly<Record<Dimension, UnitCode>> = {
  mass: "g",
  volume: "ml",
  count: "pc",
};

export function isUnitCode(value: string): value is UnitCode {
  return value === "g" || value === "kg" || value === "ml" || value === "l" || value === "pc";
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/** Quantity expressed in the dimension's base unit (g/ml/pc). */
export function toBase(quantity: number, unit: UnitCode): number {
  return round6(quantity * UNIT_META[unit].factorToBase);
}

/** Convert quantity between compatible units (identity allowed). */
export function convertQuantity(
  quantity: number,
  from: UnitCode,
  to: UnitCode,
): Result<number, AppError> {
  if (!Number.isFinite(quantity)) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Quantity must be a finite number" }));
  }
  if (UNIT_META[from].dimension !== UNIT_META[to].dimension) {
    return err(new AppError(ERROR_CODES.UNIT_CONVERSION_IMPOSSIBLE, {
      message: `Cannot convert ${from} (${UNIT_META[from].dimension}) to ${to} (${UNIT_META[to].dimension})`,
    }));
  }
  return ok(round6((toBase(quantity, from)) / UNIT_META[to].factorToBase));
}

/** Largest whole base-units obtainable from `available` given `required` per unit. */
export function howManyFit(availableBase: number, requiredBase: number): number {
  if (requiredBase <= 0) return 0;
  return Math.floor((availableBase / requiredBase) * 1e6) / 1e6;
}

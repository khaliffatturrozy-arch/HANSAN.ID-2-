/**
 * Recipes (Phase A4): ingredient requirements, producible quantity,
 * and deduction plans. All math happens in BASE units (g/ml/pc) to
 * avoid conversion drift; results rounded to 6 decimals.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { StockMaterialRecord } from "@/domain/inventory/ports";
import { toBase, type UnitCode } from "@/domain/inventory/units";

export interface RecipeIngredient {
  materialId: string;
  quantity: number;
  unit: UnitCode;
}

export interface Recipe {
  id: string;
  tenantId: string;
  /** Product this recipe produces. */
  productId: string;
  /** How many units/servings one batch yields (integer ≥ 1). */
  yieldQuantity: number;
  ingredients: RecipeIngredient[];
}

export function validateRecipe(recipe: Recipe): Result<true, AppError> {
  if (!Number.isInteger(recipe.yieldQuantity) || recipe.yieldQuantity < 1) {
    return err(new AppError(ERROR_CODES.RECIPE_INVALID, { message: "yieldQuantity must be an integer ≥ 1" }));
  }
  if (recipe.ingredients.length === 0) {
    return err(new AppError(ERROR_CODES.RECIPE_INVALID, { message: "Recipe needs at least one ingredient" }));
  }
  const seen = new Set<string>();
  for (const ing of recipe.ingredients) {
    if (!ing.materialId) {
      return err(new AppError(ERROR_CODES.RECIPE_INVALID, { message: "Ingredient materialId required" }));
    }
    if (seen.has(ing.materialId)) {
      return err(new AppError(ERROR_CODES.RECIPE_INVALID, { message: `Duplicate ingredient: ${ing.materialId}` }));
    }
    seen.add(ing.materialId);
    if (!Number.isFinite(ing.quantity) || ing.quantity <= 0) {
      return err(new AppError(ERROR_CODES.RECIPE_INVALID, { message: "Ingredient quantity must be > 0" }));
    }
  }
  return ok(true);
}

export interface MaterialStock {
  material: StockMaterialRecord;
}

export interface ProducibleBreakdown {
  /** Whole units producible with current stock. */
  units: number;
  /** Material limiting production, if any. */
  limitingMaterialId: string | null;
  perIngredient: { materialId: string; availableUnits: number }[];
}

/**
 * How many recipe units can be produced from current materials.
 * Missing material ⇒ 0 units (honest, never fabricated).
 */
export function computableProducible(
  recipe: Recipe,
  materials: StockMaterialRecord[],
): ProducibleBreakdown {
  const byId = new Map(materials.map((m) => [m.id, m]));
  let limiting: string | null = null;
  let minUnits = Number.POSITIVE_INFINITY;
  const perIngredient: { materialId: string; availableUnits: number }[] = [];

  for (const ing of recipe.ingredients) {
    const material = byId.get(ing.materialId);
    const availableBase = material ? toBase(material.quantity, material.unit) : 0;
    const requiredBase = toBase(ing.quantity * recipe.yieldQuantity, ing.unit);
    const units = requiredBase > 0 ? Math.floor((availableBase / requiredBase) * 1e6) / 1e6 : 0;
    perIngredient.push({ materialId: ing.materialId, availableUnits: units });
    if (units < minUnits) {
      minUnits = units;
      limiting = ing.materialId;
    }
  }

  const finite = Number.isFinite(minUnits) ? Math.floor(minUnits) : 0;
  return { units: Math.floor(finite), limitingMaterialId: finite === 0 ? limiting : null, perIngredient };
}

export interface DeductionLine {
  materialId: string;
  /** Signed delta in the material's own unit. */
  delta: number;
  unit: UnitCode;
}

/**
 * Stock deduction plan for producing `portions` recipe units.
 * Amounts are converted into each material's own unit; piece units
 * stay integer; mass/volume rounded up to 6 decimals to cover usage.
 */
export function buildDeductionPlan(
  recipe: Recipe,
  portions: number,
  materials: StockMaterialRecord[],
): Result<DeductionLine[], AppError> {
  if (!Number.isInteger(portions) || portions < 1) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "portions must be an integer ≥ 1" }));
  }
  const byId = new Map(materials.map((m) => [m.id, m]));
  const lines: DeductionLine[] = [];

  for (const ing of recipe.ingredients) {
    const material = byId.get(ing.materialId);
    if (!material) {
      return err(new AppError(ERROR_CODES.RECIPE_INVALID, { message: `Material not found: ${ing.materialId}` }));
    }
    const neededBase = toBase(ing.quantity * portions, ing.unit);
    const raw = neededBase / unitFactor(material.unit);
    const delta = material.unit === "pc" ? Math.ceil(raw) : Math.ceil(raw * 1e6) / 1e6;
    lines.push({ materialId: material.id, delta: -delta, unit: material.unit });
  }
  return ok(lines);
}

function unitFactor(unit: UnitCode): number {
  return unit === "kg" ? 1000 : unit === "l" ? 1000 : 1;
}

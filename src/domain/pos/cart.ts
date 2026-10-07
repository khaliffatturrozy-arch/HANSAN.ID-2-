/**
 * Cart — pure value operations for the POS order draft (Phase A2).
 * No persistence, no product catalog access: callers pass line inputs;
 * server-side prices are enforced in service.ts, never trusted here.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { OrderLine } from "@/domain/shared/ports";

export interface Cart {
  readonly lines: OrderLine[];
  /** Flat discount in whole rupiah; clamped to subtotal at totals time. */
  discountIdr: number;
}

export const EMPTY_CART: Cart = { lines: [], discountIdr: 0 };

export interface AddLineInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceIdr: number;
  station: "kitchen" | "bar";
  modifierIds?: string[];
  note?: string;
  id: string;
}

function validateLineInput(input: AddLineInput): Result<true, AppError> {
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 999) {
    return err(new AppError(ERROR_CODES.INVALID_QUANTITY, { message: "Quantity must be 1–999" }));
  }
  if (!Number.isInteger(input.unitPriceIdr) || input.unitPriceIdr < 0) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Unit price must be a non-negative integer" }));
  }
  if (!input.productId || !input.productName) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Product id and name are required" }));
  }
  if (input.station !== "kitchen" && input.station !== "bar") {
    return err(new AppError(ERROR_CODES.UNKNOWN_STATION));
  }
  return ok(true);
}

/** Add a line, or merge quantity when the same product+modifiers exists. */
export function cartAdd(cart: Cart, input: AddLineInput): Result<Cart, AppError> {
  const valid = validateLineInput(input);
  if (!valid.ok) return valid;

  const modifierKey = [...(input.modifierIds ?? [])].sort().join(",");
  const existingIndex = cart.lines.findIndex(
    (l) => l.productId === input.productId && [...l.modifierIds].sort().join(",") === modifierKey && !l.note,
  );

  if (existingIndex >= 0) {
    const existing = cart.lines[existingIndex];
    const mergedQty = existing.quantity + input.quantity;
    if (mergedQty > 999) {
      return err(new AppError(ERROR_CODES.INVALID_QUANTITY, { message: "Quantity must be 1–999" }));
    }
    const lines = [...cart.lines];
    lines[existingIndex] = { ...existing, quantity: mergedQty };
    return ok({ ...cart, lines });
  }

  const line: OrderLine = {
    id: input.id,
    productId: input.productId,
    productName: input.productName,
    quantity: input.quantity,
    unitPriceIdr: input.unitPriceIdr,
    modifierIds: input.modifierIds ?? [],
    station: input.station,
    state: "active",
    ...(input.note ? { note: input.note } : {}),
  };
  return ok({ ...cart, lines: [...cart.lines, line] });
}

export function cartSetQuantity(cart: Cart, lineId: string, quantity: number): Result<Cart, AppError> {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return err(new AppError(ERROR_CODES.INVALID_QUANTITY, { message: "Quantity must be 1–999" }));
  }
  const index = cart.lines.findIndex((l) => l.id === lineId);
  if (index < 0) return err(new AppError(ERROR_CODES.NOT_FOUND, { message: "Cart line not found" }));
  const lines = [...cart.lines];
  lines[index] = { ...lines[index], quantity };
  return ok({ ...cart, lines });
}

export function cartRemove(cart: Cart, lineId: string): Cart {
  return { ...cart, lines: cart.lines.filter((l) => l.id !== lineId) };
}

export function cartSetDiscount(cart: Cart, discountIdr: number): Result<Cart, AppError> {
  if (!Number.isInteger(discountIdr) || discountIdr < 0) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Discount must be a non-negative integer" }));
  }
  return ok({ ...cart, discountIdr });
}

export function cartSubtotalIdr(cart: Cart): number {
  return cart.lines
    .filter((l) => l.state === "active")
    .reduce((sum, l) => sum + l.quantity * l.unitPriceIdr, 0);
}

export function assertCartNotEmpty(cart: Cart): Result<true, AppError> {
  return cart.lines.some((l) => l.state === "active") ? ok(true) : err(new AppError(ERROR_CODES.CART_EMPTY));
}

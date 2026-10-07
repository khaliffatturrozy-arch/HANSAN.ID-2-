/**
 * Money — integer Indonesian Rupiah only (no floats, no minor units;
 * IDR has 0 decimal places in practice). All totals computed via
 * integer arithmetic with explicit rounding rules (Phase A1/A2/A5).
 */

export interface Money {
  readonly amount: number; // whole rupiah, non-negative for charges
  readonly currency: "IDR";
}

export function rupiah(amount: number): Money {
  if (!Number.isInteger(amount)) {
    throw new Error(`Money must be integer rupiah, received: ${amount}`);
  }
  return { amount, currency: "IDR" };
}

export const ZERO: Money = { amount: 0, currency: "IDR" };

export function addMoney(...values: Money[]): Money {
  return rupiah(values.reduce((sum, m) => sum + m.amount, 0));
}

export function subtractMoney(a: Money, b: Money): Money {
  return rupiah(a.amount - b.amount);
}

export function multiplyMoney(m: Money, factor: number): Money {
  return rupiah(Math.round(m.amount * factor));
}

/**
 * Percentage of a charge (discount/tax). Rounds half-up to whole rupiah.
 * rate is expressed in basis-free percent (e.g. 11 for 11%).
 */
export function percentOf(m: Money, percent: number): Money {
  return rupiah(Math.round((m.amount * percent) / 100));
}

export function formatIdr(m: Money): string {
  return `Rp ${m.amount.toLocaleString("id-ID")}`;
}

/**
 * Order totals — deterministic integer-rupiah computation
 * (Phase A2). Formula:
 *   subtotal  = Σ qty × price
 *   discount  = min(discountInput, subtotal)   (flat, pre-tax)
 *   taxable   = subtotal − discount
 *   tax       = round(taxable × taxPercent / 100)
 *   grand     = taxable + tax
 * All arithmetic is integer; rounding is half-up via Math.round.
 */
import { rupiah, type Money } from "@/domain/shared/money";

export interface TaxConfig {
  /** Percent (e.g. 11 for PPN 11%). 0 disables tax. */
  readonly percent: number;
  readonly label: string;
}

export interface TotalsInput {
  subtotalIdr: number;
  discountIdr: number;
  tax: TaxConfig;
}

export interface Totals {
  subtotalIdr: number;
  discountIdr: number;
  taxableIdr: number;
  taxIdr: number;
  grandTotalIdr: number;
}

export function computeTotals(input: TotalsInput): Totals {
  const subtotal = Math.max(0, Math.trunc(input.subtotalIdr));
  const requestedDiscount = Math.max(0, Math.trunc(input.discountIdr));
  const discount = Math.min(requestedDiscount, subtotal);
  const taxable = subtotal - discount;

  if (!Number.isFinite(input.tax.percent) || input.tax.percent < 0 || input.tax.percent > 100) {
    throw new Error("tax.percent must be between 0 and 100");
  }
  const taxAmount = Math.round((taxable * input.tax.percent) / 100);

  return {
    subtotalIdr: subtotal,
    discountIdr: discount,
    taxableIdr: taxable,
    taxIdr: taxAmount,
    grandTotalIdr: taxable + taxAmount,
  };
}

export function totalsAsMoney(t: Totals): { subtotal: Money; discount: Money; taxable: Money; tax: Money; grand: Money } {
  return {
    subtotal: rupiah(t.subtotalIdr),
    discount: rupiah(t.discountIdr),
    taxable: rupiah(t.taxableIdr),
    tax: rupiah(t.taxIdr),
    grand: rupiah(t.grandTotalIdr),
  };
}

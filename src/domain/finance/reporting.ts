/**
 * Financial reporting contracts (Phase A5/A8) — all inputs are REAL
 * records supplied by the caller (orders/expenses/refunds). An empty
 * input set yields structurally valid ZEROS — never fabricated values.
 */

export interface FinanceReportInput {
  paidOrders: { grandTotalIdr: number; taxIdr: number; discountIdr: number }[];
  expenses: { amountIdr: number; category: string }[];
  completedRefunds: { amountIdr: number }[];
}

export interface FinancialSummary {
  grossSalesIdr: number;
  discountsIdr: number;
  taxCollectedIdr: number;
  refundsIdr: number;
  netRevenueIdr: number;
  expensesIdr: number;
  operatingResultIdr: number;
  orderCount: number;
  refundCount: number;
  expenseCount: number;
  expensesByCategory: { category: string; amountIdr: number }[];
}

export const EMPTY_SUMMARY: FinancialSummary = {
  grossSalesIdr: 0,
  discountsIdr: 0,
  taxCollectedIdr: 0,
  refundsIdr: 0,
  netRevenueIdr: 0,
  expensesIdr: 0,
  operatingResultIdr: 0,
  orderCount: 0,
  refundCount: 0,
  expenseCount: 0,
  expensesByCategory: [],
};

export function summarizeFinancials(input: FinanceReportInput): FinancialSummary {
  if (
    input.paidOrders.length === 0 &&
    input.expenses.length === 0 &&
    input.completedRefunds.length === 0
  ) {
    return EMPTY_SUMMARY;
  }

  const gross = sum(input.paidOrders, (o) => o.grandTotalIdr);
  const discounts = sum(input.paidOrders, (o) => o.discountIdr);
  const tax = sum(input.paidOrders, (o) => o.taxIdr);
  const refunds = sum(input.completedRefunds, (r) => r.amountIdr);
  const expenses = sum(input.expenses, (e) => e.amountIdr);

  const byCategory = new Map<string, number>();
  for (const e of input.expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amountIdr);
  }

  const netRevenue = gross - refunds;
  return {
    grossSalesIdr: gross,
    discountsIdr: discounts,
    taxCollectedIdr: tax,
    refundsIdr: refunds,
    netRevenueIdr: netRevenue,
    expensesIdr: expenses,
    operatingResultIdr: netRevenue - expenses,
    orderCount: input.paidOrders.length,
    refundCount: input.completedRefunds.length,
    expenseCount: input.expenses.length,
    expensesByCategory: Array.from(byCategory, ([category, amountIdr]) => ({ category, amountIdr })),
  };
}

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + (Number.isFinite(pick(item)) ? pick(item) : 0), 0);
}

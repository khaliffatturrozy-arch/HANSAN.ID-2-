/**
 * Finance Flow Contract — §9 / Phase 11.
 * Login → dashboard → transactions → detail → refund/adjustment UI
 *   → approval UI → audit UI. No real financial processing in UI sprint.
 */

export const FINANCE_SECTIONS = [
  "overview",
  "transactions",
  "revenue",
  "expenses",
  "cash-management",
  "payment-methods",
  "refunds",
  "tax",
  "reconciliation",
  "reports",
] as const;

export type FinanceSection = (typeof FINANCE_SECTIONS)[number];

export interface FinanceTransactionRef {
  id: string;
  section: FinanceSection;
}

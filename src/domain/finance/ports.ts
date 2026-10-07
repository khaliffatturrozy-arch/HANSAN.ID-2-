/** Finance repository ports (Phase A5). */

export interface ExpenseRecord {
  id: string;
  tenantId: string;
  outletId: string;
  category: string;
  description: string;
  amountIdr: number;
  incurredAt: string;
  createdBy: string;
}

export interface RefundRecord {
  id: string;
  tenantId: string;
  outletId: string;
  orderId: string;
  amountIdr: number;
  method: "cash";
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedBy: string;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface FinancePort {
  saveExpense(e: ExpenseRecord): Promise<void>;
  listExpenses(tenantId: string, sinceIso?: string): Promise<ExpenseRecord[]>;
  getRefund(id: string): Promise<RefundRecord | null>;
  saveRefund(r: RefundRecord): Promise<void>;
  listRefunds(tenantId: string): Promise<RefundRecord[]>;
}

"use client";

import * as React from "react";

export type OrderType = "dine-in" | "take-away" | "online";

export interface PosDraft {
  orderType: OrderType | null;
  table: string | null;
  customer: string | null;
  setOrderType: (t: OrderType | null) => void;
  setTable: (t: string | null) => void;
  setCustomer: (c: string | null) => void;
  reset: () => void;
}

const PosDraftContext = React.createContext<PosDraft | null>(null);

/**
 * POS order draft — IN-MEMORY ONLY (Phase 9 rules: local state, no
 * persistence, no real transaction processing, no fake orders).
 * Lives in the /pos layout so it survives navigation between flow steps.
 * Cart is intentionally absent: menu is empty, so no items can exist (§4).
 */
export function PosOrderProvider({ children }: { children: React.ReactNode }) {
  const [orderType, setOrderType] = React.useState<OrderType | null>(null);
  const [table, setTable] = React.useState<string | null>(null);
  const [customer, setCustomer] = React.useState<string | null>(null);

  const reset = React.useCallback(() => {
    setOrderType(null);
    setTable(null);
    setCustomer(null);
  }, []);

  const value = React.useMemo(
    () => ({ orderType, table, customer, setOrderType, setTable, setCustomer, reset }),
    [orderType, table, customer, reset],
  );

  return <PosDraftContext.Provider value={value}>{children}</PosDraftContext.Provider>;
}

export function usePosDraft(): PosDraft {
  const ctx = React.useContext(PosDraftContext);
  if (!ctx) throw new Error("usePosDraft must be used inside <PosOrderProvider>");
  return ctx;
}

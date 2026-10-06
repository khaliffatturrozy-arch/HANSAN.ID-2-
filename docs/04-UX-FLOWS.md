# 04 — UX Flows

## POS (§7 — Phase 9 contract `src/types/pos.ts`)
login → home → order-type (dine-in/take-away/online) → table/customer →
menu → add-item → cart → payment → receipt → complete → history.
Clickable + coherent; no persistence.

## KDS (§8 — Phase 10 contract `src/types/kds.ts`)
Stations: kitchen / bar / all / priority / completed.
States: new → preparing → ready → completed (`KDS_TRANSITIONS`).
Empty initial state; never invent orders.

## Finance (§9 — Phase 11 contract `src/types/finance.ts`)
login → dashboard → transactions → detail → refund/adjustment UI →
approval UI → audit UI. Sections: overview, transactions, revenue,
expenses, cash-management, payment-methods, refunds, tax,
reconciliation, reports. No real processing.

## Developer (§12)
System overview, environment, health, API/DB/integration status,
feature flags, audit/error logs, configuration, tools — honest states
(not-configured, disconnected, pending-setup, unavailable, dev-mode).

## HQ (§6 — Phase 8)
Overview / Operations / Catalog / Inventory / Purchasing / Customers /
Marketing / Workforce / Finance / Analytics / Reports / Integrations /
Settings per master IA. Full nav declared in Phase 8 handoff.

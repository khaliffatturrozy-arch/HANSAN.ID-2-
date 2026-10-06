# 01 — Product Scope

## In scope (UI/UX sprint)
- Landing / front-facing experience shell (`/`)
- Development-only role access: Developer, Owner, POS, KDS, Finance (§5)
- Owner/HQ workspace navigation skeleton (§6) — full IA declared, built in Phase 8
- POS clickable flow (§7): login → home → order-type → table/customer →
  menu → add-item → cart → payment → receipt → complete → history
- KDS sections + order states (§8): kitchen/bar/all/priority/completed;
  states new → preparing → ready → completed; empty initial state
- Finance sections + approval flow (§9): overview → transactions → detail →
  refund/adjustment → approval → audit; no real processing
- Developer workspace honest states (§12): not-configured / disconnected /
  pending-setup / unavailable / development-mode
- Design system + primitives (§10, §13); responsive desktop + tablet (§12)

## Out of scope (until after UI freeze)
Real auth, RBAC enforcement, database, Prisma, Supabase, API, business
logic, payments (QRIS/EDC/marketplaces), persistence, production
security/hardening, GitHub push.

## Data policy (§4)
No fake transactions, sales, customers, products, inventory, financials,
employees, reservations, reports, revenue, expenses, stock movements.
Allowed: empty/zero/loading/skeleton/disabled/error states, structural
placeholders, dev-only role accounts, static UI config.

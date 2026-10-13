# HANSAN — Production Readiness

Status snapshot derived from **actual repository inspection** (branch `main` @ `1bf82a4`
plus uncommitted UI refinements), not from prior reports. Last updated: Phase 1 of the
Production Readiness Autopilot.

Legend for feature status:

- **UI-only** — page renders; no server call, no domain wiring.
- **Implemented locally** — domain logic exists and is unit-tested, in-memory only.
- **Persisted through backend** — writes/reads a real database via a port adapter.
- **Integration-tested** — exercised against a disposable database or API harness.
- **Production-verified** — confirmed live on the deployed environment.

---

## Feature status map

| Feature | Domain logic | UI | Persistence | Integration tests | Production | Notes |
|---|---|---|---|---|---|---|
| POS order flow | Implemented locally (A2: `src/domain/pos/*`, unit tests) | UI-only (in-memory draft, menu intentionally empty per §4) | ❌ None | ❌ | ❌ | `PosService` exists; **no API route calls it** |
| Kitchen KDS | Implemented locally (A3 + `aggregate.ts`) | UI-only (ticket board renders empty) | ❌ None | ❌ | ❌ | Station routing lives on `OrderLine.station` |
| Bar KDS | Implemented locally (same) | UI-only | ❌ None | ❌ | ❌ | Explicit `bar` station, never name-inferred |
| Checker / aggregate | Implemented locally (`kds/aggregate.ts`, tested) | UI-only | Derived at read time | ❌ | ❌ | Aggregate derived from persisted item states once persisted |
| Inventory | Implemented locally (A4, unit tests) | UI-only | ❌ None | ❌ | ❌ | Movements + race guard in memory double |
| Recipes / units | Implemented locally (`inventory/recipes.ts`, `units.ts`) | UI-only | ❌ | ❌ | ❌ | g/kg/ml/l/pc explicit |
| Workforce | Implemented locally (A6) | UI-only | ❌ | ❌ | ❌ | |
| Finance | Implemented locally (A5, refund separation-of-duties tested) | UI-only | ❌ | ❌ | ❌ | Totals derive from records when records exist |
| Settlement | Rules partially in `finance/rules.ts` | UI-only (`/finance/settlement`, uncommitted) | ❌ | ❌ | ❌ | Batch/approval persistence not built |
| Owner / HQ | Aggregations implemented locally (A8) | UI-only (honest zero states) | ❌ | ❌ | ❌ | |
| Developer | Health endpoint exists (`/api/health`) | UI-only | n/a | ❌ | ❌ | |
| Customer ordering | Implemented locally (A7) | UI-only | ❌ | ❌ | ❌ | |
| **Authentication** | Dev credentials verification only (`src/lib/dev-session.ts`) | Login page | **None — localStorage only** | ❌ | ❌ | **Not production auth** |
| **Authorization** | RBAC core implemented + unit-tested (A9/A10) | Sidebar visibility only | Server enforcement **absent** (no middleware, no guarded routes) | unit only | ❌ | P0 |
| Rate limiting | In-memory fixed window (`src/server/rate-limit.ts`) | n/a | Per-instance only | unit only | ❌ | Documented limitation |

## P0 — critical security / data-loss / tenant-isolation / financial-integrity

| ID | Finding | Evidence | Target phase |
|---|---|---|---|
| P0-1 | **No server-side authorization.** Every page relies on client-side role checks; `WorkspaceGate` is localStorage. Any future endpoint would be callable without identity. | `src/components/layout/workspace-gate.tsx`, no `src/middleware.ts` | Phase 3 |
| P0-2 | **No production authentication.** Dev session is a localStorage simulation; identity would be forgeable once APIs exist. | `src/lib/dev-session.ts` | Phase 3 (Supabase Auth blocked on BLOCKER-001; interim signed-cookie demo session, explicitly labeled demo) |
| P0-3 | **No tenant/outlet enforcement at any boundary.** `assertAccessible()` exists but is called by nothing outside tests. | `src/domain/authz/rbac.ts` | Phase 3/4 |
| P0-4 | **No persistence layer** — "orders" in the UI are never stored; a UI-only order must never be treated as a transaction. | no `prisma/schema`, no DB adapter | Phase 2/4 |
| P0-5 | **Demo/production data separation** does not exist yet because no store exists; must be guaranteed by design before the first production write. | — | Phase 2 (schema) / Phase 3 (session mode) |

## P1 — blockers to core operational workflows

| ID | Finding | Target phase |
|---|---|---|
| P1-1 | No order-creation API (transactional parent + items, idempotency). | Phase 4 |
| P1-2 | No KDS/Checker read-write API; no station-scoped progress persistence. | Phase 5 |
| P1-3 | No inventory movement API tied to the order lifecycle. | Phase 6 |
| P1-4 | No finance/settlement persistence; totals cannot derive from records. | Phase 7 |
| P1-5 | UI never calls the domain layer — pages are static shells. | Phases 4–5 (wire POS/KDS first) |

## P2 — required operational improvements

| ID | Finding | Target phase |
|---|---|---|
| P2-1 | Health endpoint reports static "Phase 0" strings; no env/db reality check. | Phase 10 |
| P2-2 | Rate limiter is per-instance (documented); needs a shared store before strict limits. | Phase 8 |
| P2-3 | No structured request logging / error monitoring integration. | Phase 8 |
| P2-4 | No backup/recovery runbook. | Phase 10 |
| P2-5 | `npm audit`: 2 advisories in Next-bundled PostCSS; only fix is breaking `next@16` — **not** to be applied blindly. | Phase 8 (assess, do not force) |
| P2-6 | No CI workflow running typecheck/lint/test/build. | Phase 8 |

## P3 — later enhancements

- Real-time KDS sync (WebSocket/SSE) — until then a documented polling refresh.
- Shared-store rate limiting (Redis/Upstash).
- Payment gateway integration (BLOCKER-005), marketplace/delivery adapters.
- Accessibility pass beyond current keyboard/focus support.

---

## Known constraint gates (cannot be resolved by code alone)

1. **BLOCKER-001** Supabase Auth credentials → real login/sessions.
2. **BLOCKER-002** `DATABASE_URL` → first migration, live adapters.
3. **BLOCKER-003** Vercel project linkage details → automated deploy verification.
4. **BLOCKER-005** Payment/delivery merchant credentials.

Until those exist, this document and `/api/health` report only honest states.
No capability is marked *Persisted* / *Integration-tested* / *Production-verified*
unless this session's validation proves it.


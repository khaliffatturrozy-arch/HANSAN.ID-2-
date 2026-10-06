# 02 — Architecture

## Stack
Next.js 14 (App Router) + React 18 + TypeScript 5 + Tailwind CSS 3.4.
No state-management library (unneeded for UI sprint). Path alias `@/* → ./src/*`.

## Structure (§15)
```
src/
  app/            # routes only: /(landing), /api/health; workspaces in Phases 7–12
  components/ui/  # generic primitives (Button, Input, Card, …) — §13
  components/layout/  # Header, Sidebar, shell, breadcrumbs
  components/shared/  # cross-module shared (EmptyState, …)
  modules/<domain>/components/  # business components ONLY (never in ui/)
  config/         # brand.ts, routes.ts (Cline-owned)
  types/          # roles.ts, pos.ts, kds.ts, finance.ts (Cline-owned contracts)
  lib/ hooks/ styles/  # styles/tokens.css is token source of truth
docs/ .cline/rules/ .github/agents/ prisma/ tests/ public/
```

## Ownership
- `src/config/routes.ts` — route registry; Copilot must not add top-level routes.
- `src/types/*` — flow/state contracts (POS steps, KDS machine, finance sections).
- `src/config/brand.ts` + `src/styles/tokens.css` + Tailwind theme — brand truth.
- Module boundary: generic UI in `components/ui`; business UI in
  `modules/<domain>/components`. `BAD: components/ui/pos-order-cart`.

## Flow model (§14)
ACCESS → WORKSPACE → NAVIGATION → FEATURE → ACTION → FEEDBACK → NEXT ACTION.
Cross-workspace: HQ → menu/inventory/staff → POS → order → KDS + Finance →
reports → HQ.

## Backend boundary (post-freeze)
Auth → RBAC → DB → Supabase → Prisma → API → logic → integrations →
security → prod QA. Frontend contracts (`src/types`) are shaped so the
dev-access layer swaps for real auth without redesign.

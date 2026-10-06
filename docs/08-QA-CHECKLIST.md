# 08 — QA Checklist (UI/UX DoD — §22)

## Per-phase
- [ ] Scope limited to handoff files; no unrelated refactors/duplicates/deps
- [ ] `npm run typecheck` green
- [ ] `npm run lint` green
- [ ] `npm run build` green

## UI/UX freeze gate
- [ ] 5 dev roles reach workspaces; sidebar/header/breadcrumbs/routes work
- [ ] POS / KDS / Finance flows navigable; HQ nav coherent; Developer coherent
- [ ] loading / empty / error / disabled states present
- [ ] Desktop + tablet usable
- [ ] Brand tokens centralized; no hardcoded brand hexes in components
- [ ] Fake-data audit: no invented transactions/sales/customers/products/
  inventory/financials/employees/reservations/reports/revenue/expenses
- [ ] Modular arch audit: ui/ vs modules/ boundaries respected
- [ ] UI + E2E checks pass; visual QA pass; architecture QA pass

## Pre-push (§26)
- [ ] No `.env` / `.env.local` / secrets / service-role keys / payment secrets
- [ ] `.env.example` placeholders only; `.gitignore` covers node_modules,
  .next, .env*, logs, coverage, dist

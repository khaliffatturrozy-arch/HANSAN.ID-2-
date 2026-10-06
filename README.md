# HANSAN — F&B / Restaurant POS & Operational SaaS

Production-oriented product foundation. Current sprint: **UI/UX +
application structure + complete navigable role flows** (§Master).
Backend, auth, database, RBAC enforcement, integrations, and production
security land AFTER the UI/UX freeze.

## Stack
Next.js 14 (App Router) · React 18 · TypeScript 5 · Tailwind CSS 3.4 ·
`@/* → ./src/*`. No state-management library (no concrete requirement).

## Quickstart
```bash
npm install
npm run dev      # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Structure (§15)
```
src/app/                 # routes (landing + /api/health in Phase 0)
src/components/ui/       # generic primitives (Copilot presentation)
src/components/layout/   # Header, Sidebar, shell, breadcrumbs
src/components/shared/   # cross-module shared
src/modules/<domain>/    # business components ONLY
src/config/              # brand.ts, routes.ts (Cline-owned)
src/types/               # roles/pos/kds/finance contracts (Cline-owned)
src/styles/tokens.css    # design-token source of truth
docs/ 00–08 · .cline/rules · .github/agents · prisma · tests · public
```

## Rules
- **Copilot = presentation.** **Cline = architecture + behavior + all else.**
- Brand truth: `src/config/brand.ts` + `src/styles/tokens.css` + Tailwind
  theme (`#FF7A00 / #0029FF / #FFF5D5`). Never hardcode brand hexes.
- No fake business data: empty/zero/loading/skeleton/disabled/error only.
- Dev-only roles: Developer, Owner, POS, KDS, Finance (§5, `src/types/roles.ts`).
- Validate: `typecheck → lint → build` (§19). GitHub push is FINAL (§25–§26).


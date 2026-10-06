# HANSAN — Cline Rules (Architecture + Behavior Owner)

You are Cline, final architectural authority (§1, §28).

## Own
Architecture, repo structure, module boundaries, routing, navigation,
role behavior, dev-auth behavior, app state, business flow, data
contracts, TS domain types, config, docs, agent config, integration,
validation, testing, lint, typecheck, build, QA, backend, auth, RBAC,
DB, Prisma, Supabase, API, logic, integrations, security, hardening,
Git/GitHub.

## Never
- Let Copilot redesign architecture or create competing folder systems.
- Build backend/persistence before UI/UX freeze (§23–§24).
- Create fake business data (§4).
- Push to GitHub before all §25 gates pass.

## Always
- TASK → SCOPE → IMPLEMENT → VERIFY → REPORT (§19).
- Keep `src/config/routes.ts` + `src/types/*` as contracts; Copilot
  implements presentation against them (§21 handoff).
- Token efficiency (§20): targeted inspection, small deterministic
  changes, incremental verification, focused reports.
- Validate: `npm run typecheck` → `npm run lint` → `npm run build`.

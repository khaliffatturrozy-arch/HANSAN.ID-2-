# HANSAN Project Constitution

> Cline is the final architectural authority. Architecture and system
> behavior take priority over visual implementation.

## 1. Product
HANSAN is an F&B / restaurant POS and operational SaaS platform:
single physical store first, multi-outlet capable later. Workspaces:
POS, HQ/owner back office, KDS, finance, developer/platform.

## 2. Sprint doctrine
Current sprint = UI/UX + structure + complete navigable role flows.
Backend, auth, database, RBAC enforcement, integrations, production
security come AFTER UI/UX freeze. No fake business data (§4): empty,
zero, loading, skeleton, disabled, and error states only.

## 3. Agent boundary (§1–§2, §28)
- **Copilot (frontend owner):** presentation, design system, brand
  styling, layouts, responsive behavior, page composition, visual
  states, micro-interactions, polish. Follows Cline's architecture,
  routes, modules, types, contracts. Never redesigns architecture or
  backend to make UI easier.
- **Cline (architecture + behavior owner):** project architecture,
  routes, navigation, role behavior, state, contracts, types, config,
  docs, rules, integration, validation, QA, backend, auth, RBAC, DB,
  API, security, Git/GitHub. May touch frontend for arch/integration/
  routing/state/a11y/behavior — without gratuitous visual redesign.
- Sequential ownership: Cline → contract → Copilot → presentation →
  Cline → integration/QA. Never both agents on the same files at once.

## 4. Quality gate (§19)
TASK → SCOPE → IMPLEMENT → VERIFY → REPORT. Identify exact files to
create/modify/leave untouched before coding. Smallest relevant
validation after coding. Concise reports.

## 5. Definition of done (§22) → UI/UX freeze (§23)
All five dev roles navigable; shell + breadcrumbs + routes + major
flows clickable; POS/KDS/Finance flows navigable; loading/empty/error/
disabled states; desktop + tablet; centralized brand tokens; no fake
data; modular arch; typecheck + lint + build green; QA pass. Then
freeze visuals and proceed to backend phase (§24) only on explicit
confirmation. GitHub push is FINAL (§25) with secret audit (§26).

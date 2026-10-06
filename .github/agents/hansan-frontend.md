# HANSAN — Copilot Instructions (Frontend Owner)

You own PRESENTATION only (§1, §28): visual UI, design system, brand
styling, layouts, responsive behavior, components, page composition,
visual states, interaction styling, a11y (frontend), micro-interactions,
polish, desktop/tablet adaptation, landing + Login/HQ/POS/KDS/Finance/
Developer UI, empty/loading/error/disabled states.

## Obey
- Follow `src/config/routes.ts`, `src/types/*`, `src/config/brand.ts`,
  `src/styles/tokens.css`, Tailwind theme — the architecture Cline set.
- Generic UI → `src/components/ui/`; business UI →
  `src/modules/<module>/components/`. Never invert.
- Brand tokens centralized; never hardcode `#FF7A00/#0029FF/#FFF5D5`
  outside token files.
- No fake business data (§4). Empty/zero/loading/skeleton/disabled/error
  states only.

## Never
- Redesign architecture, routes, module boundaries, or folder structure.
- Create backend, auth, DB, API, security, or business logic.
- Modify auth/DB/API/security to make a UI task easier.
- Push secrets; touch `.env*` real files.

## If blocked
Stop and document the required architectural/behavioral change for
Cline (§1). Do not silently rewrite architecture.

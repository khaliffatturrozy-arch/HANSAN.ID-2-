# HANSAN UI/UX Design Direction — Source of Truth

Owner-approved. This document governs every UI change. The route registry
(`src/config/routes.ts`) and domain contracts stay untouched by visual work.

## 1. Reference, not replica

Primary visual reference: **ORBIT portfolio** (`https://project-orbit-smoky.vercel.app/`).
Take from ORBIT: editorial hierarchy, numbered index rows, strong rules,
generous section rhythm, flat bordered surfaces, small uppercase eyebrows,
mono metadata, deliberate composition.
Never copy ORBIT literally. HANSAN keeps its own brand and stays an
operational tool, not a portfolio.

## 2. Brand rules (hard constraints)

- Orange `#FF7A00` — ONE primary action per screen, active accents, focus details. Never large fills.
- Blue `#0029FF` — links, info states, focus rings only.
- Ivory `#FFF5D5` / paper `#F4ECDA` — canvas background. Operational surfaces stay white.
- Ink `#1C1A15` — text, rules, active nav. Rules do the visual work shadows used to do.
- Typography: Glacial Indifference stack everywhere; mono for numbers, counts, metadata.
- Tokens live in `brand.ts` + `tokens.css` + `tailwind.config.ts`. No hardcoded hexes in components.

## 3. Composition principles

1. Hierarchy through type + spacing + rules — never shadows, gradients, decoration.
2. Flat-first: bordered white surfaces on ivory paper. `raised` shadow reserved for dialogs, drawers, login panel, floating POS cart.
3. Radius discipline: `rounded-sm` (2–6px) for operational UI; pill only for badges/steps.
4. Section rhythm: eyebrow → black title → muted description → body. `Section` component everywhere.
5. Density by role: POS/KDS large touch targets + ledger rows; HQ/Finance/Tablet dense bordered lists; mobile recomposed, never shrunk.
6. Every page: Breadcrumb + PageHeader (ink rule) + status ledger + honest next action. Empty states stay empty (§4).

## 4. Catalog hierarchy (IA source of truth)

Groups are presentation-only (`WORKSPACE_SECTION_GROUPS`); paths/labels mirror
`WORKSPACE_SECTIONS`. Sidebar + CatalogIndex render from the same groups.

- **HQ** — Command (Overview, Operations, Analytics, Reports) · Offer (Catalog, Marketing, Customers) · Supply (Inventory, Purchasing) · Organization (Workforce, Finance, Integrations, Settings).
- **POS** — Order flow in fixed order (Home → Type → Table → Menu → Cart → Pay → Receipt) + Review (History). `FlowSteps` rail on every step.
- **KDS** — Stations (Kitchen, Bar, All) + Triage (Priority, Completed). Station switcher on every board.
- **Finance** — Money movement (Overview, Transactions, Revenue, Expenses) + Control (Refunds, Tax, Reports). Refund queue surfaced on overview.
- **Developer** — Runtime (Health, Environment, Database, API) + Governance (Integrations, Audit, Configuration). Gaps queued explicitly.

Rules: never flatten everything into one list; never add top-level routes without Cline approval; section counts shown in sidebar; every group has a plain-language hint.

## 5. Role UX principles

- **Owner/HQ**: overview → setup checklist → directory. Decide fast, find any module in two taps.
- **POS**: speed + thumb reach. One primary action, flow rail, large tiles, locked Pay until cart non-empty.
- **KDS**: visibility at distance. Station counts, station switcher, lifecycle legend, oldest-wait prominent.
- **Finance**: verification first. Ledger → approvals queue → directory. Every zero labeled as true zero.
- **Developer**: diagnostics honesty. Live/stubbed/missing stated plainly; gaps queued with links.

## 6. Reuse (do not duplicate)

`Section`, `StatStrip`, `CatalogIndex`, `FlowSteps`, `ModulePage`, `PageHeader`,
`Breadcrumb`, `Table`, `Badge`, `Alert`, `EmptyState`, `Skeleton`, `Button`
(secondary = bordered, not shadowed). New patterns must extend these, not fork them.

## 7. Avoid

More cards, stacked shadows, rounded-xl/2xl operational surfaces, gradients,
decorative glyphs, generic SaaS KPI grids, fabricated data, shrinking desktop
layouts for mobile, per-page custom headers, shadow-based hierarchy.

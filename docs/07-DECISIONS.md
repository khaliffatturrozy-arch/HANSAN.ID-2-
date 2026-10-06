# 07 — Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-06 | Next 14 + React 18 + Tailwind v3 (user-selected) | Max compatibility; classic tailwind.config.ts workflow |
| 2026-10-06 | Scaffold via `create-next-app@14` into `hansan-tmp`, promoted to root | Folder name `HANSAN(2)` violates npm naming; temp-dir workaround |
| 2026-10-06 | Brand truth = `src/config/brand.ts` + `src/styles/tokens.css` + Tailwind theme | §11 compliance; no scattered hexes |
| 2026-10-06 | Route registry + domain contracts in Phase 0; no business pages | §17 Phase 0: architecture before pages |
| 2026-10-06 | Removed Geist local fonts from layout | Keep foundation neutral until Glacial Indifference licensed files land |
| 2026-10-06 | No state-management library | No concrete requirement in UI sprint (§16) |

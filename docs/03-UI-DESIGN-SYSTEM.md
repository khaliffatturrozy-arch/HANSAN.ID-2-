# 03 — UI Design System

Direction (§10): Modern Neumorphism + Minimalism + Premium SaaS.
Neumorphism selective — raised (cards, primary controls, nav surfaces),
inset (inputs, search, qty, selected), flat (dense tables, info sections,
content-heavy). Avoid excess shadow/radius/gradient/decoration.

## Tokens (§11)
Source of truth: `src/config/brand.ts` + `src/styles/tokens.css` +
`tailwind.config.ts` (`hansan.orange #FF7A00`, `hansan.blue #0029FF`,
`hansan.ivory #FFF5D5`; `--neu-raised/sm/inset`; `--radius-neu 1rem`;
`--font-brand "Glacial Indifference", …`). Never hardcode brand hexes.

## Primitives (§13 → `src/components/ui/`)
Button, IconButton, Input, Textarea, Select, Search, Card, KPI Card,
Badge, Avatar, Dropdown, Dialog, Drawer, Tabs, Table, Pagination,
Tooltip, Toast, Alert, EmptyState, Skeleton, Loading, ErrorState,
PageHeader, Breadcrumb, Sidebar, Header, NavigationItem.

## Shell (Phase 6)
Header + Sidebar + workspace shell + PageHeader + Breadcrumb; responsive
desktop-first, tablet-usable; mobile secondary. Dense operational screens
prefer flat surfaces for readability.

## States (every feature)
loading / skeleton / empty / error / disabled — required per §22.

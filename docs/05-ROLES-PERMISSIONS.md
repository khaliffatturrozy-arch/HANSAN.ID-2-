# 05 — Roles & Permissions (Development-Only)

> §5: strictly development/presentation access. NOT production
> credentials. Replaceable by real auth post-freeze without redesign.

| Role | Dev account | Home | Workspace |
|---|---|---|---|
| Developer | developer@hansan.local | /developer | System, env, health, flags, logs, config |
| Owner | owner@hansan.local | /hq | Full HQ IA (§6) |
| POS | pos@hansan.local | /pos | Order flow (§7) |
| KDS | kds@hansan.local | /kds | Stations + states (§8) |
| Finance | finance@hansan.local | /finance | Flow §9 |

Contract: `src/types/roles.ts` (`DEV_ROLES`, `DEV_ACCOUNTS`,
`homeForRole` in `src/config/routes.ts`). RBAC enforcement is
post-freeze (§24); during UI sprint, routes declare `roles` for
navigation structure only.

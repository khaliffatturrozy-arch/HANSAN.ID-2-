# HANSAN — Security Audit (Phase A9)

Scope: codebase as of Phase A9 (no credentials, no DB, no auth provider yet).
Method: manual source review + architecture analysis. Re-audit required after
each backend phase (A13+ original Phases 13–24) and before production launch.

## Findings & status

| # | Area | Finding | Status |
|---|------|---------|--------|
| 1 | Server/client boundary | Dev session (`dev-session.ts`) is localStorage-only and lives behind `"use client"` components; no secret material, no privileged operation depends on it. | ✅ Accepted (dev-only, replaced at Phase 13) |
| 2 | Open redirect | No user-controlled redirect parameters exist. `/login` redirects only to `homeForRole()` values from the route registry. | ✅ Pass |
| 3 | Error leakage | `jsonError()` returns generic "Internal error" for 5xx; AppError detail messages are non-sensitive by construction (error taxonomy). | ✅ Pass |
| 4 | Secrets | Regex sweep: no AWS/GitHub/OpenAI keys, JWTs, private keys, service-role keys in tracked files. `.gitignore` covers `.env*`, `*.key`, `*.pem`, `*.crt`, `credentials*`, `secrets*`, `service-account*`, `.ssh/`, `.aws/`. | ✅ Pass |
| 5 | IDOR / horizontal access | No object endpoints exist yet. `assertAccessible()` (tenant+outlet) is the mandated guard for all future handlers. RBAC tests enforce it (A10). | ✅ Mitigated by contract; verify at API phase |
| 6 | Privilege escalation | `ROLE_PERMISSIONS` gives `developer` ONLY `dev:*`; business permissions are impossible for the platform role. Refund approval restricted to `owner`/`finance` with separation of duties (`actorId !== requestedBy`). | ✅ Pass (unit-tested in A10) |
| 7 | CSRF | No cookie-authenticated state-changing endpoints yet. When Supabase Auth lands: use SameSite=Lax/Strict cookies + origin checks on mutations. | ⏳ Deferred to auth phase (documented) |
| 8 | Rate limiting | In-memory fixed-window limiter (`src/server/rate-limit.ts`) with documented per-instance limitation; Redis adapter required before strict global limits. | ⚠️ Partial (documented) |
| 9 | Security headers | CSP (+`frame-ancestors 'none'`), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (camera=self for future face attendance; mic/payments denied) applied to all routes via `next.config.mjs`. | ✅ Pass |
| 10 | XSS | No `dangerouslySetInnerHTML` anywhere; React escaping only; validation layer rejects oversized inputs at domain boundary. | ✅ Pass |
| 11 | SQL injection | No SQL (no DB). Future Prisma usage is parameterized by design — raw queries prohibited without review. | ✅ N/A → enforce at DB phase |
| 12 | Cookie/session | No session cookies yet. Plan: Supabase SSR cookies, `httpOnly`, `secure`, `sameSite=lax`, scoped to auth — recorded in MANUAL-BLOCKERS-001. | ⏳ Deferred to auth phase |
| 13 | Sensitive logging | Audit events exclude PII/secrets by contract (`AuditEvent.metadata` scalar-only). `console.error` on server only. | ✅ Pass |
| 14 | Webhooks | None yet. Requirement recorded: signature verification mandatory before processing any provider event. | ⏳ Deferred to integrations phase |
| 15 | Payment security | No payment processing exists; POS payment state machine never calls providers. QRIS/EDC adapter must originate amounts from stored orders (documented in A21 contracts). | ✅ N/A (honest) |
| 16 | Unsafe redirects (server) | Route handlers contain no `Location`/redirect logic yet. `requireWorkspace`/`requirePermission` gate future handlers. | ✅ Pass |
| 17 | Biometric privacy | `FaceRecognitionPort` forbids persistence; camera permission limited to self via Permissions-Policy. | ✅ Pass (interface only) |
| 18 | Audit trail | Security-sensitive actions emit `AuditEvent`s (auth, refunds, stock, config) via `AuditLogPort`. Storage adapter pending DB phase. | ✅ Contracts ready |

## Required follow-ups (blocked on credentials/manual)

1. Real session cookies + CSRF posture → BLOCKER-001.
2. Global rate-limit store (Redis) → deployment phase.
3. Re-run full audit with live auth + DB; add dependency scanning (`npm audit`) to CI.
4. Penetration-style tests: cross-tenant/outlet access attempts (A15 original RBAC tests).

## Verdict

No exploitable finding in the current (credential-free) codebase. Two items are
honestly deferred (CSRF/session, webhooks) and cannot be closed without the
auth/integration phases. This document must NOT be treated as a production
security sign-off until phases 13–24 land and this audit is re-run.

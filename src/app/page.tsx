import Link from "next/link";
import { DEV_ACCOUNTS, DEV_ROLES } from "@/types/roles";

/**
 * Phase 0 landing — front-facing shell only.
 * Workspace routes are declared but not yet implemented (Phases 7–12).
 * §4: no fake business data anywhere on this page.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--hansan-surface)] px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--hansan-ink-muted)]">
          HANSAN · F&amp;B Operations Platform
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Modern operations for the single store,
          <span className="text-hansan-orange"> ready for multi-outlet.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--hansan-ink-muted)]">
          POS, HQ back office, KDS, finance, and developer operations in one
          coherent product. This foundation sprint establishes architecture,
          design tokens, and navigable role flows — before backend,
          authentication, or production data.
        </p>

        <section
          aria-label="Development workspaces"
          className="mt-12 rounded-[var(--radius-neu)] bg-[var(--hansan-surface-soft)] p-8 shadow-[var(--neu-raised)]"
        >
          <h2 className="text-xl font-semibold">Development workspaces</h2>
          <p className="mt-2 text-sm text-[var(--hansan-ink-muted)]">
            Development-only access (§5). Sign in with a development account
            to enter a role workspace — sessions are local to this browser.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEV_ROLES.map((role) => {
              const account = DEV_ACCOUNTS[role];
              return (
                <li
                  key={role}
                  className="rounded-2xl bg-[var(--hansan-surface-soft)] p-5 shadow-[var(--neu-raised-sm)]"
                >
                  <p className="font-semibold">{account.label}</p>
                  <p className="mt-1 text-sm text-[var(--hansan-ink-muted)]">
                    {account.description}
                  </p>
                  <p className="mt-3 font-mono text-xs text-[var(--hansan-ink-muted)]">
                    {account.home}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-hansan-orange px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--neu-raised-sm)] transition hover:brightness-105"
            >
              Development sign-in
            </Link>
            <Link
              href="/api/health"
              className="rounded-xl bg-[var(--hansan-surface-soft)] px-5 py-2.5 text-sm font-semibold text-hansan-ink shadow-[var(--neu-raised-sm)] transition hover:brightness-105"
            >
              Check system health
            </Link>
            <span className="inline-flex items-center rounded-xl bg-[var(--hansan-surface-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--hansan-ink-muted)] shadow-[var(--neu-inset)]">
              UI/UX sprint · Phases 0–7 foundation + role access
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}


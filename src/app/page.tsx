import Link from "next/link";
import { DEV_ACCOUNTS, DEV_ROLES } from "@/types/roles";

/**
 * Landing — editorial front door (design direction).
 * ORBIT-informed: strong rule hierarchy, numbered workspace index,
 * HANSAN brand (orange/blue/ivory, Glacial Indifference stack).
 * §4: no fake business data anywhere on this page.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-hansan-surface px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-hansan-ink-muted">
          <span aria-hidden className="inline-block h-2 w-2 bg-hansan-orange" />
          HANSAN · F&amp;B Operations Platform
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          One floor.
          <br />
          Every station, <span className="text-hansan-orange">in order.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-hansan-ink-muted sm:text-lg">
          POS, HQ back office, KDS, finance, and developer operations in one
          coherent product. This foundation sprint establishes architecture,
          design tokens, and navigable role flows — before backend,
          authentication, or production data.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-sm bg-hansan-orange px-6 text-sm font-bold text-white shadow-neu-raised-sm transition hover:brightness-105"
          >
            Development sign-in →
          </Link>
          <Link
            href="/api/health"
            className="inline-flex h-11 items-center justify-center rounded-sm border border-hansan-line-strong bg-hansan-surface-raised px-6 text-sm font-bold text-hansan-ink transition hover:border-hansan-ink"
          >
            Check system health
          </Link>
        </div>

        <section aria-label="Development workspaces" className="mt-14">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-hansan-ink pb-3">
            <h2 className="text-xl font-black tracking-tight">Development workspaces</h2>
            <p className="font-mono text-xs text-hansan-ink-muted">05 roles</p>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-hansan-ink-muted">
            Development-only access. Sign in with a development account
            to enter a role workspace — sessions are local to this browser.
          </p>
          <ol className="mt-5 overflow-hidden rounded-sm border border-hansan-line bg-hansan-surface-raised">
            {DEV_ROLES.map((role, i) => {
              const account = DEV_ACCOUNTS[role];
              return (
                <li key={role} className="border-b border-hansan-line last:border-b-0">
                  <Link href="/login" className="group flex items-center gap-4 px-5 py-4 transition hover:bg-hansan-surface-soft">
                    <span aria-hidden className="font-mono text-xs text-hansan-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-hansan-ink group-hover:underline group-hover:decoration-hansan-orange group-hover:underline-offset-4">
                        {account.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-hansan-ink-muted">
                        {account.description}
                      </span>
                    </span>
                    <span className="hidden font-mono text-xs text-hansan-ink-muted sm:block">
                      {account.home}
                    </span>
                    <span aria-hidden className="text-hansan-ink-muted transition group-hover:translate-x-0.5 group-hover:text-hansan-orange">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 inline-flex items-center rounded-sm border border-hansan-line bg-hansan-surface-soft px-4 py-2 text-xs font-semibold text-hansan-ink-muted">
            UI/UX sprint · Phases 0–7 foundation + role access
          </p>
        </section>
      </div>
    </main>
  );
}


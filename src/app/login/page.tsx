"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEV_ACCOUNTS, DEV_ROLES } from "@/types/roles";
import { verifyDevCredentials, writeDevSession } from "@/lib/dev-session";
import { homeForRole } from "@/config/routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

/**
 * Development sign-in (Phase 7) — LOCAL-ONLY role simulation.
 * No backend, no API, no database, no real authentication.
 * Credentials live in `src/lib/dev-session.ts` (dev environment only).
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const role = verifyDevCredentials(email, password);
    if (!role) {
      setSubmitting(false);
      setError(
        "Unknown development account. Use one of the five development sign-ins listed below.",
      );
      return;
    }
    writeDevSession(role);
    router.replace(homeForRole(role));
  }

  function quickSignIn(role: (typeof DEV_ROLES)[number]) {
    writeDevSession(role);
    router.replace(homeForRole(role));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hansan-surface px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-hansan-orange text-lg font-black text-white shadow-neu-raised-sm">
            H
          </span>
          <span className="text-2xl font-black tracking-tight text-hansan-ink">HANSAN</span>
        </Link>

        <section className="rounded-neu bg-hansan-surface-soft p-6 shadow-neu-raised sm:p-8">
          <h1 className="text-xl font-bold text-hansan-ink">Development sign-in</h1>
          <p className="mt-1.5 text-sm text-hansan-ink-muted">
            Local-only role simulation for the UI/UX sprint. No real authentication —
            sessions are stored in this browser only.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="developer@hansan.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Alert tone="danger" role="alert">
                {error}
              </Alert>
            )}
            <Button type="submit" loading={submitting} className="w-full">
              Sign in to workspace
            </Button>
          </form>
        </section>

        <section className="mt-6 rounded-neu bg-hansan-surface-soft p-6 shadow-neu-raised">
          <h2 className="text-sm font-bold uppercase tracking-wider text-hansan-ink-muted">
            Development accounts
          </h2>
          <p className="mt-1 text-xs text-hansan-ink-muted">
            Click a role to sign in instantly (demo shortcut). Development-only identities.
          </p>
          <ul className="mt-4 space-y-2">
            {DEV_ROLES.map((role) => {
              const account = DEV_ACCOUNTS[role];
              return (
                <li key={role}>
                  <button
                    type="button"
                    onClick={() => quickSignIn(role)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl bg-hansan-surface px-4 py-3 text-left shadow-neu-raised-sm transition hover:brightness-[1.03] focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-hansan-ink">
                        {account.label}
                      </span>
                      <span className="block font-mono text-xs text-hansan-ink-muted">
                        {account.email}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-hansan-blue">Enter →</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}

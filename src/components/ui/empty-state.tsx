import * as React from "react";
import Link from "next/link";
import { Button } from "./button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional structural action (e.g. "Create menu"). */
  actionLabel?: string;
  onAction?: () => void;
  /** Link target — preferred over onAction in server components. */
  actionHref?: string;
  className?: string;
}

/**
 * EmptyState — the honest default during UI sprint (§4: no fake data).
 * Every list/table surface must render this when it has no records.
 */
export function EmptyState({ title, description, actionLabel, onAction, actionHref, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-neu border border-dashed border-hansan-line bg-hansan-surface-soft px-6 py-14 text-center ${className}`.trim()}>
      <span aria-hidden className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-hansan-surface text-2xl shadow-neu-inset">
        ◻
      </span>
      <h3 className="text-base font-bold text-hansan-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-hansan-ink-muted">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-8 items-center justify-center rounded-xl bg-hansan-surface px-5 text-xs font-semibold text-hansan-ink shadow-neu-raised-sm transition hover:brightness-[1.03]"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

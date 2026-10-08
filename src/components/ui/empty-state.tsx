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
    <div className={`flex flex-col items-center justify-center rounded-sm border border-dashed border-hansan-line-strong bg-hansan-surface-raised px-6 py-14 text-center ${className}`.trim()}>
      <span aria-hidden className="mb-4 flex h-14 w-14 items-center justify-center rounded-sm border border-hansan-line bg-hansan-surface-soft text-2xl text-hansan-ink-muted">
        ◻
      </span>
      <h3 className="text-base font-bold text-hansan-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-hansan-ink-muted">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-8 items-center justify-center rounded-sm border border-hansan-line-strong bg-hansan-surface-raised px-5 text-xs font-bold text-hansan-ink transition hover:border-hansan-ink"
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

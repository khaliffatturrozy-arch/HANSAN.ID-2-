import * as React from "react";
import { Card } from "./card";

export interface KpiCardProps {
  label: string;
  /** Zero-state display only — never fabricated business metrics (§4). */
  value: string;
  hint?: string;
  loading?: boolean;
  className?: string;
}

/**
 * KPI Card — zero-state metrics only during UI sprint (§4).
 * Loading shows skeleton; never invent values.
 */
export function KpiCard({ label, value, hint, loading, className = "" }: KpiCardProps) {
  return (
    <Card className={className} aria-label={label}>
      <p className="text-xs font-semibold uppercase tracking-wider text-hansan-ink-muted">
        {label}
      </p>
      {loading ? (
        <div
          aria-hidden
          className="mt-3 h-8 w-24 animate-pulse rounded-md bg-hansan-line"
        />
      ) : (
        <p className="mt-2 text-3xl font-bold text-hansan-ink">{value}</p>
      )}
      {hint && <p className="mt-2 text-xs text-hansan-ink-muted">{hint}</p>}
    </Card>
  );
}

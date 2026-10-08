import * as React from "react";

/**
 * StatStrip — flat metric row for workspace overviews (design direction).
 * Bordered ledger row, not cards: label / value / hint columns that
 * collapse gracefully on mobile. Zero-state values stay honest (§4).
 */
export function StatStrip({ items }: { items: { label: string; value: string; hint?: string }[] }) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-sm border border-hansan-line bg-hansan-surface-raised lg:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`px-5 py-4 ${i > 0 ? "border-l border-hansan-line" : ""} ${
            i >= 2 ? "max-lg:border-t max-lg:border-hansan-line" : ""
          } ${i === 2 ? "max-lg:border-l-0" : ""}`.trim()}
        >
          <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-hansan-ink-muted">{item.label}</dt>
          <dd className="mt-1 text-2xl font-black tabular-nums tracking-tight text-hansan-ink">{item.value}</dd>
          {item.hint && <dd className="mt-1 text-xs text-hansan-ink-muted">{item.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}

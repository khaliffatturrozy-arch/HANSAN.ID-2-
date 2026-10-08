import * as React from "react";

/**
 * Section — editorial content block (design direction).
 * Label rule + title + optional description + body. Replaces ad-hoc
 * card-stacking for page structure: hierarchy via type + rules.
 */
export function Section({
  eyebrow,
  title,
  description,
  actions,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-10 first:mt-0 ${className}`.trim()}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-hansan-line pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-hansan-orange">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-hansan-ink">{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-sm text-hansan-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

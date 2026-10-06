import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail — required on every workspace page (§7 / Phase 6). */
export function Breadcrumb({ items, className = "" }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={`mb-4 ${className}`.trim()}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-hansan-ink-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-hansan-ink-muted/60">/</span>}
              {item.href && !last ? (
                <Link href={item.href} className="transition hover:text-hansan-blue">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="font-semibold text-hansan-ink">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import * as React from "react";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}

/** Numeric pagination — disabled at bounds (§22 disabled states). */
export function Pagination({ page, pageCount, onChange, className = "" }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1 ${className}`.trim()}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="h-9 w-9 rounded-lg bg-hansan-surface-soft text-hansan-ink shadow-neu-raised-sm transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onChange(p)}
          className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
            p === page ? "bg-hansan-blue text-white shadow-neu-raised-sm" : "bg-hansan-surface-soft text-hansan-ink shadow-neu-raised-sm hover:brightness-[1.03]"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="h-9 w-9 rounded-lg bg-hansan-surface-soft text-hansan-ink shadow-neu-raised-sm transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        ›
      </button>
    </nav>
  );
}

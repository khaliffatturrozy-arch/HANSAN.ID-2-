import * as React from "react";

/** Inline loading spinner with accessible label. */
export function Loading({ label = "Loading…", className = "" }: { label?: string; className?: string }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-10 text-hansan-ink-muted ${className}`.trim()}>
      <span aria-hidden className="h-6 w-6 animate-spin rounded-full border-[3px] border-hansan-line border-t-hansan-orange" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/** Honest error surface — describes failure, offers retry (§22). */
export function ErrorState({ title = "Something went wrong", description, onRetry, className = "" }: ErrorStateProps) {
  return (
    <div role="alert" className={`flex flex-col items-center rounded-neu border border-hansan-danger/30 bg-hansan-surface-soft px-6 py-12 text-center ${className}`.trim()}>
      <span aria-hidden className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-hansan-danger/10 text-xl text-hansan-danger">
        !
      </span>
      <h3 className="text-base font-bold text-hansan-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-hansan-ink-muted">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 h-9 rounded-xl bg-hansan-surface-soft px-5 text-sm font-semibold text-hansan-ink shadow-neu-raised-sm transition hover:brightness-[1.03]"
        >
          Retry
        </button>
      )}
    </div>
  );
}

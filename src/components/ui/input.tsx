import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/** Inset input primitive (§10: inputs use inset elevation). */
export function Input({ label, error, hint, id, className = "", ...rest }: InputProps) {
  const inputId = id ?? rest.name ?? `input-${label?.replace(/\s+/g, "-").toLowerCase() ?? "field"}`;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-hansan-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className="h-10 w-full rounded-sm border border-hansan-line bg-hansan-surface-raised px-4 text-sm text-hansan-ink transition duration-fast placeholder:text-hansan-ink-muted focus-visible:outline-none focus-visible:border-hansan-blue focus-visible:[box-shadow:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-hansan-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-hansan-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

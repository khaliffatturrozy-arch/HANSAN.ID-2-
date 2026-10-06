import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...rest }: TextareaProps) {
  const inputId = id ?? rest.name ?? "textarea-field";
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-hansan-ink">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        className="min-h-24 w-full rounded-xl bg-hansan-surface-soft px-4 py-3 text-sm text-hansan-ink shadow-neu-inset transition duration-fast placeholder:text-hansan-ink-muted focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring),var(--neu-inset)] disabled:cursor-not-allowed disabled:opacity-50"
        {...rest}
      />
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-hansan-danger">
          {error}
        </p>
      )}
    </div>
  );
}

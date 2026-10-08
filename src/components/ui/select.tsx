import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, id, className = "", ...rest }: SelectProps) {
  const inputId = id ?? rest.name ?? "select-field";
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-hansan-ink">
          {label}
        </label>
      )}
      <select
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        className="h-10 w-full cursor-pointer rounded-sm border border-hansan-line bg-hansan-surface-raised px-4 text-sm text-hansan-ink transition duration-fast focus-visible:outline-none focus-visible:border-hansan-blue focus-visible:[box-shadow:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-hansan-danger">
          {error}
        </p>
      )}
    </div>
  );
}

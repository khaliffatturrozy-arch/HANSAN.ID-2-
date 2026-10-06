import { Input, type InputProps } from "./input";

export interface SearchProps extends Omit<InputProps, "type"> {
  onClear?: () => void;
}

/** Inset search field (§10) with optional clear action. */
export function Search({ onClear, value, ...rest }: SearchProps) {
  const showClear = onClear && value !== undefined && String(value).length > 0;
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-hansan-ink-muted">
        ⌕
      </span>
      <Input type="search" className="[&_input]:pl-10" value={value} {...rest} />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 text-hansan-ink-muted hover:text-hansan-ink"
        >
          ✕
        </button>
      )}
    </div>
  );
}

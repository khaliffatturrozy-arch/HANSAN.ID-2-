import * as React from "react";

export interface DropdownItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Accessible listbox-style dropdown (button + menu, keyboard navigable).
 * Structural UI config only — options passed by callers, never fake data.
 */
export function Dropdown({ label, items, value, onChange, placeholder = "Select…", className = "" }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = items.find((i) => i.value === value);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`.trim()}>
      <span className="mb-1.5 block text-sm font-semibold text-hansan-ink">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full items-center justify-between rounded-xl bg-hansan-surface-soft px-4 text-sm text-hansan-ink shadow-neu-inset focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring),var(--neu-inset)]"
      >
        <span className={selected ? "" : "text-hansan-ink-muted"}>{selected?.label ?? placeholder}</span>
        <span aria-hidden className="text-hansan-ink-muted">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute z-dropdown mt-2 max-h-60 w-full overflow-auto rounded-xl border border-hansan-line bg-hansan-surface-raised p-1 shadow-neu-raised"
        >
          {items.length === 0 ? (
            <li className="px-3 py-2 text-sm text-hansan-ink-muted">No options</li>
          ) : (
            items.map((item) => (
              <li key={item.value} role="option" aria-selected={item.value === value}>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    onChange?.(item.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-hansan-ink transition hover:bg-hansan-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

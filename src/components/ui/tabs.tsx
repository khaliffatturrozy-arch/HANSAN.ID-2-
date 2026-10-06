import * as React from "react";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Keyboard-navigable tab group (roving focus via arrow keys). */
export function Tabs({ label, items, value, onChange, className = "" }: TabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === value);
    if (idx === -1) return;
    const next =
      e.key === "ArrowRight"
        ? enabled[(idx + 1) % enabled.length]
        : enabled[(idx - 1 + enabled.length) % enabled.length];
    onChange(next.value);
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`inline-flex rounded-xl bg-hansan-surface-soft p-1 shadow-neu-inset ${className}`.trim()}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition duration-fast focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 ${
              selected ? "bg-hansan-surface-raised text-hansan-ink shadow-neu-flat" : "text-hansan-ink-muted hover:text-hansan-ink"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

import Link from "next/link";

/**
 * FlowSteps — linear progress rail for the POS order flow (design direction).
 * Numbered steps with done/current/todo states; POS-optimized for speed
 * and low cognitive load. Links only — no fabricated order data.
 */
export function FlowSteps({
  steps,
  current,
  className = "",
}: {
  steps: { href: string; label: string }[];
  current: string;
  className?: string;
}) {
  const currentIdx = Math.max(
    0,
    steps.findIndex((s) => s.href === current),
  );
  return (
    <ol aria-label="Order progress" className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      {steps.map((step, i) => {
        const state = i < currentIdx ? "done" : i === currentIdx ? "current" : "todo";
        return (
          <li key={step.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="h-px w-6 bg-hansan-line-strong" />}
            <Link
              href={step.href}
              aria-current={state === "current" ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] ${
                state === "current"
                  ? "border-hansan-ink bg-hansan-ink text-hansan-ivory"
                  : state === "done"
                    ? "border-hansan-line-strong bg-hansan-surface-raised text-hansan-ink hover:border-hansan-ink"
                    : "border-hansan-line bg-hansan-surface-soft text-hansan-ink-muted hover:text-hansan-ink"
              }`}
            >
              <span
                aria-hidden
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  state === "current" ? "bg-hansan-orange text-white" : state === "done" ? "bg-hansan-success text-white" : "bg-hansan-surface-sunken text-hansan-ink-muted"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              {step.label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

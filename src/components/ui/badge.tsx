import * as React from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "border border-hansan-line bg-hansan-surface-soft text-hansan-ink-muted",
  info: "border border-hansan-blue/30 bg-hansan-blue/10 text-hansan-blue",
  success: "border border-hansan-success/30 bg-hansan-success/10 text-hansan-success",
  warning: "border border-hansan-warning/30 bg-hansan-warning/10 text-hansan-warning",
  danger: "border border-hansan-danger/30 bg-hansan-danger/10 text-hansan-danger",
};

/** Status badge — UI states (e.g. order states), never business data itself. */
export function Badge({ tone = "neutral", className = "", children, ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TONE_CLASS[tone]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}

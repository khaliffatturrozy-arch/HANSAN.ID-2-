import * as React from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

/** Hover/focus tooltip — supplementary labels only. */
export function Tooltip({ content, children, className = "" }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <span
      className={`relative inline-flex ${className}`.trim()}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-tooltip mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-hansan-ink px-3 py-1.5 text-xs font-medium text-white shadow-neu-flat"
        >
          {content}
        </span>
      )}
    </span>
  );
}

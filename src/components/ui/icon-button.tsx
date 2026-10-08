import * as React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md";
}

/** Icon-only button with mandatory accessible label (§13). */
export function IconButton({
  label,
  size = "md",
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-sm bg-hansan-surface-raised text-hansan-ink border border-hansan-line transition duration-fast hover:border-hansan-ink focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}

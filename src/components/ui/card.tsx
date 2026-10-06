import * as React from "react";

export type CardElevation = "raised" | "flat";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING_CLASS = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

/**
 * Card primitive — raised for important surfaces, flat for dense content (§10).
 */
export function Card({
  elevation = "raised",
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  const elevationClass =
    elevation === "raised"
      ? "bg-hansan-surface-soft shadow-neu-raised"
      : "bg-hansan-surface-raised shadow-neu-flat border border-hansan-line";
  return (
    <div
      className={`rounded-neu ${elevationClass} ${PADDING_CLASS[padding]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

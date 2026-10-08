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
 * Card primitive — flat-first operational surfaces (§10 + design direction).
 * raised: dialogs, login panel, floating summaries only.
 * flat (default): bordered white surfaces for lists, tables, info sections.
 */
export function Card({
  elevation = "flat",
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  const elevationClass =
    elevation === "raised"
      ? "bg-hansan-surface-soft shadow-neu-raised"
      : "border border-hansan-line bg-hansan-surface-raised";
  return (
    <div
      className={`rounded-neu ${elevationClass} ${PADDING_CLASS[padding]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

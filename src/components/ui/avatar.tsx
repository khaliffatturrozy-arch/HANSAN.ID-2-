import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Initials or short label — dev accounts only in UI sprint. */
  initials: string;
  size?: "sm" | "md" | "lg";
}

/** Avatar — initials only; no real employee photos in UI sprint. */
export function Avatar({ initials, size = "md", className = "", ...rest }: AvatarProps) {
  const sizeClass =
    size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center rounded-full bg-hansan-surface font-bold text-hansan-ink shadow-neu-inset ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}

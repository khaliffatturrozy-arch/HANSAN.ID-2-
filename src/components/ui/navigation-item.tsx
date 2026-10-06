import * as React from "react";
import Link from "next/link";

export interface NavigationItemProps {
  href: string;
  label: string;
  /** Glyph shown when sidebar is collapsed. */
  icon?: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
  badge?: React.ReactNode;
  /** Marks routes declared but not yet implemented (routes.ts). */
  pending?: boolean;
}

/**
 * Sidebar navigation link — active state + honest "soon" marker
 * for routes whose `implemented: false` in the registry (§4 honesty).
 */
export function NavigationItem({ href, label, icon, active, collapsed, badge, pending }: NavigationItemProps) {
  return (
    <Link
      href={pending ? "#" : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={pending || undefined}
      title={collapsed ? label : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-fast focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] ${
        active
          ? "bg-hansan-orange text-white shadow-neu-raised-sm"
          : "text-hansan-ink hover:bg-hansan-surface-raised hover:shadow-neu-raised-sm"
      } ${pending ? "opacity-60" : ""} ${collapsed ? "justify-center px-2" : ""}`}
    >
      {icon && <span aria-hidden className="flex h-5 w-5 items-center justify-center text-base">{icon}</span>}
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge && <span className="shrink-0">{badge}</span>}
      {!collapsed && pending && (
        <span className="shrink-0 rounded-full bg-hansan-surface px-2 py-0.5 text-[10px] font-bold uppercase text-hansan-ink-muted">
          soon
        </span>
      )}
    </Link>
  );
}

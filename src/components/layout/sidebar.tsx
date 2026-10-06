"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSPACE_ROUTES, WORKSPACE_SECTIONS } from "@/config/routes";
import type { DevRole } from "@/types/roles";
import { NavigationItem } from "@/components/ui/navigation-item";

export interface SidebarProps {
  /** Current dev session role — filters visible routes. */
  role: DevRole;
  collapsed?: boolean;
  /** Mobile drawer close handler (undefined on desktop). */
  onNavigate?: () => void;
}

const ROLE_GLYPH: Record<DevRole, string> = {
  developer: "⌘",
  owner: "◎",
  pos: "▣",
  kds: "☰",
  finance: "¤",
};

/**
 * Workspace sidebar — builds navigation ONLY from WORKSPACE_ROUTES +
 * WORKSPACE_SECTIONS (single source of truth, §15). Shows the role's
 * workspaces, and the active workspace's section sub-navigation.
 */
export function Sidebar({ role, collapsed = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const routes = WORKSPACE_ROUTES.filter(
    (r) => r.roles.includes(role) && r.path !== "/" && r.path !== "/login",
  );
  const activeRoot = routes.find(
    (r) => pathname === r.path || pathname.startsWith(`${r.path}/`),
  );
  const sections = activeRoot ? WORKSPACE_SECTIONS[activeRoot.path] ?? [] : [];

  return (
    <nav
      aria-label="Workspace navigation"
      className="flex h-full flex-col gap-1 overflow-y-auto p-3"
    >
      <Link
        href="/"
        onClick={onNavigate}
        className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 ${collapsed ? "justify-center" : ""}`}
      >
        <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-hansan-orange text-sm font-black text-white shadow-neu-raised-sm">
          H
        </span>
        {!collapsed && <span className="text-lg font-black tracking-tight text-hansan-ink">HANSAN</span>}
      </Link>

      {!collapsed && (
        <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-hansan-ink-muted">
          Workspaces
        </p>
      )}

      {routes.map((route) => (
        <NavigationItem
          key={route.path}
          href={route.path}
          label={route.label}
          icon={<span aria-hidden>{ROLE_GLYPH[role]}</span>}
          active={activeRoot?.path === route.path}
          collapsed={collapsed}
          pending={!route.implemented}
        />
      ))}

      {!collapsed && sections.length > 0 && (
        <>
          <p className="mb-1 mt-5 px-3 text-[11px] font-bold uppercase tracking-wider text-hansan-ink-muted">
            {activeRoot?.label} sections
          </p>
          {sections.map((section) => (
            <Link
              key={section.path}
              href={section.path}
              onClick={onNavigate}
              aria-current={pathname === section.path ? "page" : undefined}
              className={`ml-3 flex items-center gap-2 rounded-lg border-l-2 py-2 pl-3 pr-2 text-sm transition duration-fast focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] ${
                pathname === section.path
                  ? "border-hansan-orange bg-hansan-surface-raised font-semibold text-hansan-ink shadow-neu-flat"
                  : "border-hansan-line text-hansan-ink-muted hover:text-hansan-ink"
              }`}
            >
              {section.label}
            </Link>
          ))}
        </>
      )}

      <div className="mt-auto" />
      {!collapsed && (
        <p className="px-3 pb-1 pt-4 text-[11px] text-hansan-ink-muted">
          Dev mode · {role} role
        </p>
      )}
    </nav>
  );
}

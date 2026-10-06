"use client";

import * as React from "react";
import type { DevRole } from "@/types/roles";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export interface WorkspaceShellProps {
  role: DevRole;
  contextLabel?: string;
  /** Page content (PageHeader + page body). */
  children: React.ReactNode;
}

/**
 * Workspace shell (Phase 6): fixed header + collapsible sidebar + drawer
 * for mobile/tablet. Workspace pages only render children inside this.
 */
export function WorkspaceShell({ role, contextLabel, children }: WorkspaceShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-hansan-surface text-hansan-ink">
      <Header
        role={role}
        contextLabel={contextLabel}
        onToggleMenu={() => setDrawerOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
      />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside
          className={`sticky top-[var(--shell-header-h)] hidden h-[calc(100vh-var(--shell-header-h))] shrink-0 border-r border-hansan-line bg-hansan-surface-soft transition-[width] duration-base lg:block ${
            sidebarCollapsed ? "w-[var(--shell-sidebar-collapsed-w)]" : "w-[var(--shell-sidebar-w)]"
          }`}
        >
          <Sidebar role={role} collapsed={sidebarCollapsed} />
        </aside>

        {/* Mobile / tablet drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-drawer lg:hidden" role="presentation">
            <button
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 cursor-default bg-hansan-ink/30"
            />
            <aside className="absolute left-0 top-0 h-full w-72 border-r border-hansan-line bg-hansan-surface-soft shadow-neu-raised">
              <Sidebar role={role} onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-shell px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

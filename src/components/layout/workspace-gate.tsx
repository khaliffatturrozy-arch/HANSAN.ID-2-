"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { DevRole } from "@/types/roles";
import { DEV_ACCOUNTS } from "@/types/roles";
import { readDevSession } from "@/lib/dev-session";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { Loading, ErrorState } from "@/components/ui/feedback";

export interface WorkspaceGateProps {
  /** Role required to enter this workspace (routes.ts contract). */
  role: DevRole;
  children: React.ReactNode;
}

type GateStatus = "loading" | "guest" | "wrong-role" | "ready";

/**
 * Client-side dev access gate for a workspace segment (Phase 7).
 * Wraps WorkspaceShell around children once the local dev session
 * matches the required role. No backend — localStorage simulation only.
 * Layout-level so the shell stays mounted across in-workspace navigation.
 */
export function WorkspaceGate({ role, children }: WorkspaceGateProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<GateStatus>("loading");

  React.useEffect(() => {
    const session = readDevSession();
    if (!session) {
      setStatus("guest");
      router.replace("/login");
      return;
    }
    setStatus(session.role === role ? "ready" : "wrong-role");
  }, [role, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-hansan-surface">
        <Loading label="Checking development session…" />
      </div>
    );
  }

  if (status === "guest") {
    // Effect will redirect; keep an honest placeholder for one paint.
    return (
      <div className="min-h-screen bg-hansan-surface">
        <Loading label="Redirecting to sign-in…" />
      </div>
    );
  }

  if (status === "wrong-role") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hansan-surface p-6">
        <ErrorState
          title="Access denied for this development role"
          description={`This workspace requires the ${DEV_ACCOUNTS[role].label} role. Switch accounts from the development sign-in page to continue.`}
          onRetry={() => router.replace("/login")}
        />
      </div>
    );
  }

  return (
    <WorkspaceShell role={role} contextLabel={DEV_ACCOUNTS[role].label}>
      {children}
    </WorkspaceShell>
  );
}

import { WorkspaceGate } from "@/components/layout/workspace-gate";

/**
 * HQ workspace segment (Phase 8) — owner role only (routes.ts contract).
 * Gate provides Header + Sidebar + Breadcrumb shell; pages render inside.
 */
export default function HqLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceGate role="owner">{children}</WorkspaceGate>;
}

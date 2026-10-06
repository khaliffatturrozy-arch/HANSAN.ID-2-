import { WorkspaceGate } from "@/components/layout/workspace-gate";

/** KDS workspace segment (Phase 10) — kds role only. */
export default function KdsLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceGate role="kds">{children}</WorkspaceGate>;
}

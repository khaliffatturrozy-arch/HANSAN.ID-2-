import { WorkspaceGate } from "@/components/layout/workspace-gate";

/** Finance workspace segment (Phase 11) — finance role only. */
export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceGate role="finance">{children}</WorkspaceGate>;
}

import { WorkspaceGate } from "@/components/layout/workspace-gate";

/** Developer workspace segment (Phase 12) — developer role only. */
export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceGate role="developer">{children}</WorkspaceGate>;
}

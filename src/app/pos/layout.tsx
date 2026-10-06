import { WorkspaceGate } from "@/components/layout/workspace-gate";
import { PosOrderProvider } from "@/components/modules/pos/order-context";

/**
 * POS workspace segment (Phase 9) — pos role only.
 * Provider keeps the in-memory order draft across flow-step navigation.
 */
export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceGate role="pos">
      <PosOrderProvider>{children}</PosOrderProvider>
    </WorkspaceGate>
  );
}

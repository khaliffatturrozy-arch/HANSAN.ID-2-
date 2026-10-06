import { ModulePage } from "@/components/shared/module-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/**
 * KDS — Kitchen view (Phase 10). Initial state: NO active orders.
 * The state legend is structural (order lifecycle from types/kds.ts),
 * not fabricated orders.
 */
export default function KdsKitchenPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "KDS" }]}
      title="Kitchen"
      purpose="Kitchen ticket board: incoming food orders move through New → Preparing → Ready → Completed."
      status={{
        label: "No active orders",
        detail:
          "The kitchen board is empty — zero tickets are queued. Tickets appear here automatically when POS sends dine-in/take-away orders (backend phase).",
      }}
      nextAction="Tickets will queue here automatically when POS orders reach the kitchen via the post-freeze backend; the board stays honestly empty until then."
    >
      <Card padding="sm" elevation="flat">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-hansan-ink-muted">
          Order lifecycle
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">New</Badge>
          <span aria-hidden className="text-hansan-ink-muted">→</span>
          <Badge tone="warning">Preparing</Badge>
          <span aria-hidden className="text-hansan-ink-muted">→</span>
          <Badge tone="success">Ready</Badge>
          <span aria-hidden className="text-hansan-ink-muted">→</span>
          <Badge tone="neutral">Completed</Badge>
        </div>
      </Card>
    </ModulePage>
  );
}

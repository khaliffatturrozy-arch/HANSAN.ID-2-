import { ModulePage } from "@/components/shared/module-page";
import { KpiCard } from "@/components/ui/kpi-card";

/**
 * POS Home (Phase 9) — zero-state only. No historical or fabricated orders.
 */
export default function PosHomePage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "POS" }]}
      title="POS Home"
      purpose="Point-of-sale start screen: begin a new order or review this terminal's history."
      status={{
        label: "Idle · no active order",
        detail:
          "No order is in progress and no past orders exist in this environment. The register starts clean every session.",
      }}
      nextAction="Start a new order to walk the full flow: order type → table/customer → menu → cart → payment → receipt."
      actionLabel="Start new order"
      actionHref="/pos/order-type"
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Orders today" value="0" hint="No orders taken yet" />
        <KpiCard label="Open tabs" value="0" hint="No open tables or tabs" />
        <KpiCard label="Net sales today" value="Rp 0" hint="No transactions yet" />
      </div>
    </ModulePage>
  );
}

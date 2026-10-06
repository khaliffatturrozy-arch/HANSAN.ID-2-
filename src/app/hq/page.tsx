import { ModulePage } from "@/components/shared/module-page";
import { KpiCard } from "@/components/ui/kpi-card";
import { Alert } from "@/components/ui/alert";

/**
 * HQ Overview (Phase 8) — zero-state metrics only (§4).
 * Rp 0 / 0 counts are honest empty values, never fabricated results.
 */
export default function HqOverviewPage() {
  return (
    <div>
      <ModulePage
        breadcrumbs={[{ label: "HQ" }]}
        title="HQ Overview"
        purpose="Single back-office control room for the outlet: performance, operations, and setup progress at a glance."
        status={{
          label: "Empty workspace",
          tone: "warning",
          detail:
            "This deployment has no business records yet — no outlets, orders, customers, or inventory exist. All metrics intentionally show zero until real data arrives after the backend phase.",
        }}
        nextAction="Start onboarding: set up the catalog in Catalog, then outlets and stock in Inventory. Metrics populate automatically once real records exist."
        actionLabel="Go to Catalog"
        actionHref="/hq/catalog"
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Revenue" value="Rp 0" hint="Today · no transactions yet" />
          <KpiCard label="Orders" value="0" hint="Today · no orders yet" />
          <KpiCard label="Customers" value="0" hint="No customer records yet" />
          <KpiCard label="Inventory" value="0 items" hint="No stock records yet" />
        </div>
        <Alert tone="info" title="Onboarding guidance">
          HANSAN ships empty by design during the UI/UX sprint. Work through the
          sidebar sections in order — Catalog → Inventory → Workforce → Operations —
          to complete the structural setup checklist.
        </Alert>
      </ModulePage>
    </div>
  );
}

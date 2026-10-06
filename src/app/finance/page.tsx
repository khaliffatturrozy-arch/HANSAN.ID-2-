import { ModulePage } from "@/components/shared/module-page";
import { KpiCard } from "@/components/ui/kpi-card";

/**
 * Finance Overview (Phase 11) — zero metrics only. No financial
 * calculations are performed during the UI sprint (§4).
 */
export default function FinanceOverviewPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance" }]}
      title="Finance Overview"
      purpose="Financial command center: today's money movement, pending approvals, and period summaries."
      status={{
        label: "Rp 0 · 0 transactions",
        detail:
          "No transactions exist, so every figure is a true zero. No calculations, forecasts, or trial numbers are produced in this sprint.",
      }}
      nextAction="After backend launch, POS settlements post here automatically; until then use the sidebar to preview each module's structure."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Net revenue" value="Rp 0" hint="No postings" />
        <KpiCard label="Transactions" value="0" hint="None recorded" />
        <KpiCard label="Expenses" value="Rp 0" hint="None recorded" />
        <KpiCard label="Pending refunds" value="0" hint="None requested" />
      </div>
    </ModulePage>
  );
}

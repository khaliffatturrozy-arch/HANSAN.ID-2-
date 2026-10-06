import { ModulePage } from "@/components/shared/module-page";
import { KpiCard } from "@/components/ui/kpi-card";

export default function FinanceRevenuePage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Revenue" }]}
      title="Revenue"
      purpose="Revenue breakdown by period, outlet, and channel — the source of truth for income reporting."
      status={{
        label: "Rp 0",
        detail:
          "Zero revenue because zero sales exist. No charts render fabricated trend lines — series will plot from real rows only.",
      }}
      nextAction="Revenue accumulates automatically from settled POS orders after the backend phase."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Today" value="Rp 0" />
        <KpiCard label="This week" value="Rp 0" />
        <KpiCard label="This month" value="Rp 0" />
      </div>
    </ModulePage>
  );
}

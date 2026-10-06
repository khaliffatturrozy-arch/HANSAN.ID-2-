import { ModulePage } from "@/components/shared/module-page";
import { KpiCard } from "@/components/ui/kpi-card";

export default function FinanceTaxPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Tax" }]}
      title="Tax"
      purpose="Tax configuration and collected-tax reporting: rates, rules, and period filings."
      status={{
        label: "Rp 0 collected · no tax profile",
        detail:
          "No tax rules are configured and no taxable sales exist, so collected tax is structurally zero. No rates are guessed or applied.",
      }}
      nextAction="Configure the outlet tax profile in HQ → Settings; collected tax then reports per period here."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Tax collected (period)" value="Rp 0" />
        <KpiCard label="Taxable base" value="Rp 0" />
        <KpiCard label="Active tax rules" value="0" />
      </div>
    </ModulePage>
  );
}

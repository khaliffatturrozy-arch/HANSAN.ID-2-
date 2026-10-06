import { ModulePage } from "@/components/shared/module-page";

export default function FinanceReportsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Reports" }]}
      title="Reports"
      purpose="Financial exports: daily settlement, P&L snapshots, tax summaries, and audit packs."
      status={{
        label: "No reports available",
        detail:
          "Reports require posted financial data; none exists yet. Nothing is exported from empty or fabricated datasets.",
      }}
      nextAction="Once transactions post, generate your first daily settlement report here and export it as PDF or CSV."
    />
  );
}

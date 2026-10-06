import { ModulePage } from "@/components/shared/module-page";

export default function HqReportsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Reports" }]}
      title="Reports"
      purpose="Scheduled and on-demand report generation: sales, inventory, labor, and financial exports."
      status={{
        label: "No reports generated",
        detail:
          "No report jobs or exports exist. Report definitions will be listed here once reporting runs on real data.",
      }}
      nextAction="Pick a report template after data exists; exports (PDF/CSV) will download from this page."
    />
  );
}

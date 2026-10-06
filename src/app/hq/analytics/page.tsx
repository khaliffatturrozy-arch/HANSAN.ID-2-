import { ModulePage } from "@/components/shared/module-page";

export default function HqAnalyticsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Analytics" }]}
      title="Analytics"
      purpose="Exploratory analysis: sales trends, product performance, and outlet comparisons."
      status={{
        label: "No data to analyze",
        detail:
          "Analytics requires historical records; none exist yet. Charts will render honestly from zero rows rather than synthetic series.",
      }}
      nextAction="Once orders flow through POS after backend launch, this becomes the insight layer for decisions."
    />
  );
}

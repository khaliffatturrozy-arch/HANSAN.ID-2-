import { ModulePage } from "@/components/shared/module-page";

export default function HqFinancePage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Finance" }]}
      title="Finance"
      purpose="HQ-level financial lens: summarized revenue, expenses, and cash position across outlets."
      status={{
        label: "Rp 0 · no postings",
        detail:
          "No financial postings exist. All amounts show Rp 0 — no estimates or projections are fabricated (§4).",
      }}
      nextAction="Detailed ledgers live in the Finance workspace; here you will later review consolidated HQ figures."
    />
  );
}

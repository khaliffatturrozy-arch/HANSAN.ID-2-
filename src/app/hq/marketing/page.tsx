import { ModulePage } from "@/components/shared/module-page";

export default function HqMarketingPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Marketing" }]}
      title="Marketing"
      purpose="Promotions engine: discounts, campaigns, vouchers, and their performance attribution."
      status={{
        label: "No campaigns",
        detail:
          "No promotions or vouchers are configured. Any campaign list will remain honestly empty until one is created.",
      }}
      nextAction="Plan a first promotion once the catalog exists — campaigns attach to products and price rules."
    />
  );
}

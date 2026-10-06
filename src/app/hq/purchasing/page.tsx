import { ModulePage } from "@/components/shared/module-page";

export default function HqPurchasingPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Purchasing" }]}
      title="Purchasing"
      purpose="Supplier and purchase-order management: quotes, receiving, and supplier cost history."
      status={{
        label: "No suppliers or orders",
        detail:
          "No suppliers, purchase orders, or receipts exist. This module is structural only during the UI sprint.",
      }}
      nextAction="Register suppliers and create the first purchase order once inventory items are defined."
    />
  );
}

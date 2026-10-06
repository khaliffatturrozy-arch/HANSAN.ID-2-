import { ModulePage } from "@/components/shared/module-page";

export default function HqCustomersPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Customers" }]}
      title="Customers"
      purpose="Customer records: profiles, loyalty state, visit history, and consent preferences."
      status={{
        label: "0 customers",
        detail:
          "No customer records exist. Counts stay at zero — no demo or placeholder people are ever created (§4).",
      }}
      nextAction="Enable customer capture at POS (name/phone at checkout) to start building real customer records."
    />
  );
}

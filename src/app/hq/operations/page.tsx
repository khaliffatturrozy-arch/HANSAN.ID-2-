import { ModulePage } from "@/components/shared/module-page";

export default function HqOperationsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Operations" }]}
      title="Operations"
      purpose="Day-to-day outlet supervision: service flow, live order queues, and outlet health in one view."
      status={{
        label: "No active operations",
        detail:
          "No outlets, tables, or orders are configured yet. Live operational views populate once outlets are set up and orders flow through POS.",
      }}
      nextAction="Define outlets and floor structure first, then this page becomes the live operations watchtower during service hours."
    />
  );
}

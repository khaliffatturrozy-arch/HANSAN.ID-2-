import { ModulePage } from "@/components/shared/module-page";

export default function HqIntegrationsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Integrations" }]}
      title="Integrations"
      purpose="Third-party connections: payment gateways, delivery platforms, accounting, and messaging."
      status={{
        label: "Pending setup",
        tone: "warning",
        detail:
          "No integrations are connected. Each card will honestly show its connection state (disconnected / connected / error) — nothing is simulated.",
      }}
      nextAction="After the backend phase, connect services from here; credentials will be entered in the production environment only."
    />
  );
}

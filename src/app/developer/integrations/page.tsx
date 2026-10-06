import { ModulePage } from "@/components/shared/module-page";

export default function DeveloperIntegrationsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer", href: "/developer" }, { label: "Integrations" }]}
      title="Integrations"
      purpose="Technical integration status: payment, delivery, messaging, and accounting connectors."
      status={{
        label: "Pending setup",
        tone: "warning",
        detail:
          "No integrations exist — not even disabled stubs. Each connector will appear here only when actually implemented.",
      }}
      nextAction="Integrations are scoped during the backend phase; credentials will be handled server-side, never in this UI."
    />
  );
}

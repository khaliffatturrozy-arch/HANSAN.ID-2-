import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

export default function DeveloperEnvironmentPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer", href: "/developer" }, { label: "Environment" }]}
      title="Environment"
      purpose="Runtime and configuration inventory: framework versions, build mode, and environment variables status."
      status={{
        label: "Development mode",
        tone: "warning",
        detail:
          "Running as a local development scaffold. No production environment variables are loaded, and .env files stay empty placeholders.",
      }}
      nextAction="Populate real environment values (server-side only) during the backend phase — never commit secrets."
    >
      <Table
        caption="Environment"
        columns={[
          { key: "key", header: "Key", render: () => "—" },
          { key: "scope", header: "Scope", render: () => "—" },
          { key: "status", header: "Status", render: () => "—" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No environment variables loaded — .env.example placeholders only."
      />
    </ModulePage>
  );
}

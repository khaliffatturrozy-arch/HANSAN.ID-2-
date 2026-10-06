import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

export default function DeveloperAuditPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer", href: "/developer" }, { label: "Audit" }]}
      title="Audit"
      purpose="System audit trail: configuration changes, access events, and administrative actions."
      status={{
        label: "0 events",
        detail:
          "No audit events exist — the application has no user actions or admin changes to record yet. The log is never pre-seeded.",
      }}
      nextAction="Audit logging activates with real auth and backend actions post-freeze; events will stream into this table."
    >
      <Table
        caption="Audit events"
        columns={[
          { key: "time", header: "Time", render: () => "—" },
          { key: "actor", header: "Actor", render: () => "—" },
          { key: "event", header: "Event", render: () => "—" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No audit events recorded."
      />
    </ModulePage>
  );
}

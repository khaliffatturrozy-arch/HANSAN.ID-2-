import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

/** KDS — All Orders: unified queue across kitchen + bar. */
export default function KdsAllOrdersPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "KDS", href: "/kds" }, { label: "All Orders" }]}
      title="All Orders"
      purpose="Unified ticket queue across every station, with age and status at a glance."
      status={{
        label: "0 tickets",
        detail:
          "The unified queue is empty — no orders exist in any state. Empty is the true initial state (§4).",
      }}
      nextAction="When POS orders flow post-freeze, every ticket appears here sorted by creation time."
    >
      <Table
        caption="All tickets"
        columns={[
          { key: "id", header: "Ticket", render: () => "—" },
          { key: "station", header: "Station", render: () => "—" },
          { key: "state", header: "State", render: () => "—" },
          { key: "age", header: "Age", align: "right", render: () => "—" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No tickets — kitchen and bar queues are empty."
      />
    </ModulePage>
  );
}

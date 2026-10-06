import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

/** KDS — Completed: finished tickets archive. Empty initially. */
export default function KdsCompletedPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "KDS", href: "/kds" }, { label: "Completed" }]}
      title="Completed"
      purpose="Archive of finished tickets: what left the kitchen, when, and how long it took."
      status={{
        label: "0 completed",
        detail:
          "No tickets have been completed — no orders have ever entered this board. The archive is never seeded with demo history (§4).",
      }}
      nextAction="Completed tickets accumulate here automatically after real orders are served."
    >
      <Table
        caption="Completed tickets"
        columns={[
          { key: "id", header: "Ticket", render: () => "—" },
          { key: "completed", header: "Completed at", render: () => "—" },
          { key: "duration", header: "Prep time", align: "right", render: () => "—" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No completed tickets yet."
      />
    </ModulePage>
  );
}

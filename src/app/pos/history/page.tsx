import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

/**
 * Step 7 — order history. Empty by policy: no fake historical orders (§4).
 */
export default function PosHistoryPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "POS", href: "/pos" }, { label: "History" }]}
      title="Order History"
      purpose="Look up this terminal's past orders: receipts, voids, and reprints by time range."
      status={{
        label: "0 orders",
        detail:
          "No order history exists — this environment has never processed a transaction. History is never backfilled with demo orders.",
      }}
      nextAction="Take a real order after backend launch; completed orders will list here with time, type, and total."
      actionLabel="Start new order"
      actionHref="/pos/order-type"
    >
      <Table
        caption="Recent orders"
        columns={[
          { key: "time", header: "Time", render: () => "—" },
          { key: "type", header: "Order type", render: () => "—" },
          { key: "total", header: "Total", align: "right", render: () => "Rp 0" },
          { key: "status", header: "Status", render: () => "—" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No orders yet — history stays empty until real orders are taken."
      />
    </ModulePage>
  );
}

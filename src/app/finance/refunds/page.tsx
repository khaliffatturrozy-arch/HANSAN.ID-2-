import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

export default function FinanceRefundsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Refunds" }]}
      title="Refunds"
      purpose="Refund request queue: review, approve, and track money returned to customers."
      status={{
        label: "0 requests",
        detail:
          "No refunds have been requested — no original transactions exist to refund.",
      }}
      nextAction="Refunds raised from POS orders will enter this approval queue automatically post-freeze."
    >
      <Table
        caption="Refund requests"
        columns={[
          { key: "date", header: "Requested", render: () => "—" },
          { key: "ref", header: "Original order", render: () => "—" },
          { key: "reason", header: "Reason", render: () => "—" },
          { key: "amount", header: "Amount", align: "right", render: () => "Rp 0" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No refund requests."
      />
    </ModulePage>
  );
}

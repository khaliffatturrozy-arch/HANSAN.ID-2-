import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

export default function FinanceTransactionsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Transactions" }]}
      title="Transactions"
      purpose="Ledger of every sale, refund, and adjustment with settlement status."
      status={{
        label: "0 transactions",
        detail:
          "No financial transactions have ever posted to this environment. The ledger starts empty by design.",
      }}
      nextAction="Once POS processes real payments post-freeze, each settlement lands here with full audit detail."
    >
      <Table
        caption="Transactions"
        columns={[
          { key: "date", header: "Date", render: () => "—" },
          { key: "ref", header: "Reference", render: () => "—" },
          { key: "method", header: "Method", render: () => "—" },
          { key: "amount", header: "Amount", align: "right", render: () => "Rp 0" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No transactions recorded."
      />
    </ModulePage>
  );
}

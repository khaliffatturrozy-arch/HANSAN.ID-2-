import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

export default function FinanceExpensesPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Expenses" }]}
      title="Expenses"
      purpose="Operating expense log: costs, categories, approvals, and payment status."
      status={{
        label: "Rp 0 · 0 entries",
        detail:
          "No expense entries exist. Costs will be recorded manually or imported from integrations after launch.",
      }}
      nextAction="Record the first expense after backend launch, or connect an accounting integration from HQ → Integrations."
    >
      <Table
        caption="Expenses"
        columns={[
          { key: "date", header: "Date", render: () => "—" },
          { key: "category", header: "Category", render: () => "—" },
          { key: "note", header: "Note", render: () => "—" },
          { key: "amount", header: "Amount", align: "right", render: () => "Rp 0" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="No expenses recorded."
      />
    </ModulePage>
  );
}

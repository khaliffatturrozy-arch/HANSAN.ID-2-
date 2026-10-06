import { ModulePage } from "@/components/shared/module-page";
import { Table } from "@/components/ui/table";

/**
 * Step 4 — cart. Cart can never hold items during the UI sprint because
 * the menu is empty; totals are structurally Rp 0 (§4, no fake lines).
 */
export default function PosCartPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "POS", href: "/pos" }, { label: "Cart" }]}
      title="Cart"
      purpose="Review items, quantities, discounts, and totals before sending the order to payment."
      status={{
        label: "0 items · Rp 0",
        detail:
          "The cart is empty because no menu items exist yet. Totals are structurally zero — no line items are ever invented.",
      }}
      nextAction="Add items from the menu step (once the catalog exists). Payment stays locked while the cart is empty."
      actionLabel="Back to menu"
      actionHref="/pos/menu"
    >
      <Table
        caption="Cart items"
        columns={[
          { key: "item", header: "Item", render: () => "—" },
          { key: "qty", header: "Qty", align: "center", render: () => "—" },
          { key: "price", header: "Price", align: "right", render: () => "Rp 0" },
          { key: "total", header: "Total", align: "right", render: () => "Rp 0" },
        ]}
        rows={[]}
        rowKey={(r) => r as unknown as string}
        emptyMessage="Cart is empty — no items added."
      />
      <div className="mt-4 flex justify-end rounded-neu bg-hansan-surface-soft px-5 py-4 shadow-neu-raised-sm">
        <p className="text-sm text-hansan-ink-muted">
          Subtotal <span className="ml-6 font-bold text-hansan-ink">Rp 0</span>
        </p>
        <p className="ml-8 text-sm text-hansan-ink-muted">
          Total <span className="ml-6 font-bold text-hansan-ink">Rp 0</span>
        </p>
      </div>
    </ModulePage>
  );
}

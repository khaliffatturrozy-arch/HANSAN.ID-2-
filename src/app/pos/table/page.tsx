"use client";

import { useRouter } from "next/navigation";
import { ModulePage } from "@/components/shared/module-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosDraft } from "@/components/modules/pos/order-context";

/**
 * Step 2 — table / customer assignment.
 * Tables come from HQ floor plans (none configured) — honest empty state.
 */
export default function PosTablePage() {
  const router = useRouter();
  const draft = usePosDraft();

  return (
    <ModulePage
      breadcrumbs={[{ label: "POS", href: "/pos" }, { label: "Table / Customer" }]}
      title="Table / Customer"
      purpose={
        draft.orderType
          ? `Assign ${draft.orderType === "dine-in" ? "a table" : draft.orderType === "online" ? "a customer" : "a customer (optional)"} to the current ${draft.orderType} order.`
          : "Assign a table or customer to the order in progress."
      }
      status={{
        label: draft.table || draft.customer ? "Assigned" : "Nothing assigned",
        tone: draft.table || draft.customer ? "success" : "warning",
        detail:
          "No floor plan or customer records exist yet, so no tables or customers can be picked. You can continue — the order simply stays unassigned.",
      }}
      nextAction="Continue to the menu step, or configure a floor plan in HQ → Settings later to enable table selection."
      actionLabel="Go to menu"
      actionHref="/pos/menu"
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-neu bg-hansan-surface-soft p-5 shadow-neu-raised-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-hansan-ink-muted">
            Tables
          </p>
          <p className="mt-2 text-sm text-hansan-ink-muted">
            0 tables configured — floor plans are set up in HQ after freeze.
          </p>
        </div>
        <div className="rounded-neu bg-hansan-surface-soft p-5 shadow-neu-raised-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-hansan-ink-muted">
            Customer
          </p>
          <div className="mt-3">
            <Input
              name="customer-search"
              placeholder="Search customer (no records yet)"
              disabled
              hint="Customer capture activates when the backend is connected."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => router.push("/pos/order-type")}>
          Back
        </Button>
        <Button onClick={() => router.push("/pos/menu")}>Continue to menu</Button>
      </div>
    </ModulePage>
  );
}

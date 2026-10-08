"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlowSteps } from "@/components/ui/flow-steps";
import { usePosDraft, type OrderType } from "@/components/modules/pos/order-context";

export const POS_FLOW = [
  { href: "/pos/order-type", label: "Type" },
  { href: "/pos/table", label: "Table" },
  { href: "/pos/menu", label: "Menu" },
  { href: "/pos/cart", label: "Cart" },
  { href: "/pos/payment", label: "Pay" },
  { href: "/pos/receipt", label: "Receipt" },
];

const ORDER_TYPES: { value: OrderType; label: string; hint: string; glyph: string }[] = [
  { value: "dine-in", label: "Dine In", hint: "Guests seated at a table", glyph: "◉" },
  { value: "take-away", label: "Take Away", hint: "Counter pickup order", glyph: "▣" },
  { value: "online", label: "Online", hint: "Delivery / app orders", glyph: "◇" },
];

/** Step 1 — choose order type (in-memory draft only). */
export default function PosOrderTypePage() {
  const router = useRouter();
  const draft = usePosDraft();
  const [selected, setSelected] = React.useState<OrderType | null>(draft.orderType);

  return (
    <div>
      <Breadcrumb items={[{ label: "POS", href: "/pos" }, { label: "Order Type" }]} />
      <PageHeader
        title="Order Type"
        description="Choose how this order will be served. The selection is kept in memory only for this session."
      />

      <FlowSteps steps={POS_FLOW} current="/pos/order-type" className="mb-6" />

      <div className="grid gap-px overflow-hidden rounded-sm border border-hansan-line bg-hansan-line sm:grid-cols-3">
        {ORDER_TYPES.map((t) => {
          const active = selected === t.value;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(t.value)}
              className={`flex min-h-44 flex-col items-start bg-hansan-surface-raised p-6 text-left transition duration-fast focus-visible:outline-none focus-visible:[box-shadow:inset_var(--focus-ring)] hover:bg-hansan-surface-soft ${
                active
                  ? "border-t-4 border-t-hansan-orange"
                  : ""
              }`}
            >
              <span aria-hidden className="text-2xl text-hansan-orange">{t.glyph}</span>
              <span className="mt-3 text-base font-bold text-hansan-ink">{t.label}</span>
              <span className="mt-1 text-sm text-hansan-ink-muted">{t.hint}</span>
              {active && <Badge tone="info" className="mt-3">Selected</Badge>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button
          disabled={!selected}
          onClick={() => {
            draft.setOrderType(selected);
            router.push("/pos/table");
          }}
        >
          Continue
        </Button>
        {!selected && (
          <p className="text-sm text-hansan-ink-muted">Select an order type to continue.</p>
        )}
      </div>

      <ModulePageStatusNote />
    </div>
  );
}

/** Honest status note — required status explanation for this step. */
function ModulePageStatusNote() {
  return (
    <p className="mt-8 rounded-sm border border-hansan-line bg-hansan-surface-raised px-4 py-3 text-xs text-hansan-ink-muted">
      Status: no order submitted yet. This draft never leaves your browser — nothing is
      saved, charged, or sent anywhere (UI sprint rules).
    </p>
  );
}

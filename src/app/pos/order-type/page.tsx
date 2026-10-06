"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePosDraft, type OrderType } from "@/components/modules/pos/order-context";

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

      <div className="grid gap-4 sm:grid-cols-3">
        {ORDER_TYPES.map((t) => {
          const active = selected === t.value;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(t.value)}
              className={`flex flex-col items-start rounded-neu p-6 text-left transition duration-fast focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] ${
                active
                  ? "bg-hansan-surface-raised shadow-neu-raised ring-2 ring-hansan-orange"
                  : "bg-hansan-surface-soft shadow-neu-raised-sm hover:brightness-[1.03]"
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
    <p className="mt-8 rounded-xl bg-hansan-surface-soft px-4 py-3 text-xs text-hansan-ink-muted shadow-neu-flat">
      Status: no order submitted yet. This draft never leaves your browser — nothing is
      saved, charged, or sent anywhere (UI sprint rules).
    </p>
  );
}

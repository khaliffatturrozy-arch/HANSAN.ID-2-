"use client";

import * as React from "react";
import { ModulePage } from "@/components/shared/module-page";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "qr", label: "QRIS" },
];

/**
 * Step 5 — payment. Pay action is DISABLED: cart is empty and no
 * payment processing exists during the UI sprint (no real transactions).
 */
export default function PosPaymentPage() {
  const [method, setMethod] = React.useState<string>("cash");
  const cartEmpty = true; // menu is empty → no items can ever be in cart (§4)

  return (
    <ModulePage
      breadcrumbs={[{ label: "POS", href: "/pos" }, { label: "Payment" }]}
      title="Payment"
      purpose="Tender the order: choose a payment method, apply split/tender options, and confirm."
      status={{
        label: cartEmpty ? "Locked · cart empty" : "Ready",
        tone: cartEmpty ? "warning" : "success",
        detail: cartEmpty
          ? "There is nothing to pay for — the cart holds no items, and no payment gateway is connected during the UI sprint."
          : "Awaiting tender.",
      }}
      nextAction="Add items in the menu step to unlock this screen. Payment processing activates only after the backend phase."
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {METHODS.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-pressed={method === m.value}
            disabled={cartEmpty}
            onClick={() => setMethod(m.value)}
            className={`rounded-sm border px-4 py-4 text-sm font-bold transition duration-fast focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 ${
              method === m.value && !cartEmpty
                ? "border-hansan-orange bg-hansan-surface-raised text-hansan-ink ring-2 ring-hansan-orange"
                : "border-hansan-line bg-hansan-surface-raised text-hansan-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between rounded-sm border border-hansan-line bg-hansan-surface-raised px-5 py-4">
        <span className="text-sm text-hansan-ink-muted">Amount due</span>
        <span className="text-2xl font-bold text-hansan-ink">Rp 0</span>
      </div>

      <Button className="w-full sm:w-auto" disabled={cartEmpty} loading={false}>
        Pay Rp 0
      </Button>

      <Alert tone="info" className="mt-4" title="Why is Pay disabled?">
        This is an honest disabled state (§22): empty cart, and payment
        processing is out of scope until the post-freeze backend phase.
      </Alert>
    </ModulePage>
  );
}

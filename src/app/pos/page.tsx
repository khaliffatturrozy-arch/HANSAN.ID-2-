import Link from "next/link";
import { ModulePage } from "@/components/shared/module-page";
import { Section } from "@/components/ui/section";
import { StatStrip } from "@/components/ui/stat-strip";
import { FlowSteps } from "@/components/ui/flow-steps";

const FLOW = [
  { href: "/pos/order-type", label: "Type" },
  { href: "/pos/table", label: "Table" },
  { href: "/pos/menu", label: "Menu" },
  { href: "/pos/cart", label: "Cart" },
  { href: "/pos/payment", label: "Pay" },
  { href: "/pos/receipt", label: "Receipt" },
];

/**
 * POS Home (Phase 9) — speed-first start screen: one primary action,
 * today's honest ledger, and the order-flow rail. No fabricated orders.
 */
export default function PosHomePage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "POS" }]}
      title="POS Home"
      purpose="Start a new order in one tap, or pick up where the flow left off. Built for counter speed."
      status={{
        label: "Idle · no active order",
        detail:
          "No order is in progress and no past orders exist in this environment. The register starts clean every session.",
      }}
      nextAction="Start a new order to walk the full flow: order type → table/customer → menu → cart → payment → receipt."
      actions={
        <Link
          href="/pos/order-type"
          className="inline-flex h-11 items-center justify-center rounded-sm bg-hansan-orange px-6 text-sm font-bold text-white shadow-neu-raised-sm transition hover:brightness-105 focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
        >
          Start new order →
        </Link>
      }
    >
      <Section eyebrow="Shift" title="Today's register" description="Honest zeros — fills automatically once real orders post.">
        <StatStrip
          items={[
            { label: "Orders today", value: "0", hint: "No orders taken yet" },
            { label: "Open tabs", value: "0", hint: "No open tables or tabs" },
            { label: "Net sales", value: "Rp 0", hint: "No transactions yet" },
            { label: "Avg ticket", value: "Rp 0", hint: "No tickets yet" },
          ]}
        />
      </Section>

      <Section eyebrow="Flow" title="Order rail" description="Seven steps, always in this order. Tap any step to jump back in.">
        <div className="rounded-sm border border-hansan-line bg-hansan-surface-raised p-4">
          <FlowSteps steps={FLOW} current="/pos/order-type" />
        </div>
      </Section>

      <Section eyebrow="Review" title="After the sale" description="Receipts and terminal history live one tap away.">
        <Link
          href="/pos/history"
          className="group flex items-center gap-4 rounded-sm border border-hansan-line bg-hansan-surface-raised px-5 py-4 transition hover:border-hansan-ink"
        >
          <span aria-hidden className="font-mono text-xs text-hansan-ink-muted">08</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-hansan-ink group-hover:underline group-hover:decoration-hansan-orange group-hover:underline-offset-4">
              Order history
            </span>
            <span className="mt-0.5 block text-xs text-hansan-ink-muted">Past tickets from this terminal — empty until the first sale.</span>
          </span>
          <span aria-hidden className="text-hansan-ink-muted transition group-hover:translate-x-0.5 group-hover:text-hansan-orange">→</span>
        </Link>
      </Section>
    </ModulePage>
  );
}


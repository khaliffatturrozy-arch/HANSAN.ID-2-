import Link from "next/link";
import { ModulePage } from "@/components/shared/module-page";
import { Section } from "@/components/ui/section";
import { StatStrip } from "@/components/ui/stat-strip";
import { Badge } from "@/components/ui/badge";

/**
 * KDS — Kitchen view (Phase 10). Station-first triage: live counts,
 * lifecycle legend, and station switcher. Initial state: NO active orders.
 */
export default function KdsKitchenPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "KDS" }]}
      title="Kitchen"
      purpose="Kitchen ticket board: incoming food orders move through New → Preparing → Ready → Completed."
      status={{
        label: "No active orders",
        detail:
          "The kitchen board is empty — zero tickets are queued. Tickets appear here automatically when POS sends dine-in/take-away orders (backend phase).",
      }}
      nextAction="Tickets will queue here automatically when POS orders reach the kitchen via the post-freeze backend; the board stays honestly empty until then."
    >
      <Section eyebrow="Board" title="Live queue" description="Station counts stay at zero until the first real ticket lands.">
        <StatStrip
          items={[
            { label: "New", value: "0", hint: "Awaiting fire" },
            { label: "Preparing", value: "0", hint: "On the line" },
            { label: "Ready", value: "0", hint: "Awaiting pickup" },
            { label: "Oldest wait", value: "—", hint: "No tickets queued" },
          ]}
        />
      </Section>

      <Section eyebrow="Stations" title="Switch station" description="One board per station — cooks see only their fire.">
        <div className="grid gap-px overflow-hidden rounded-sm border border-hansan-line bg-hansan-line sm:grid-cols-3">
          {[
            { href: "/kds", label: "Kitchen", hint: "Food line · current", active: true },
            { href: "/kds/bar", label: "Bar", hint: "Drinks · 0 tickets", active: false },
            { href: "/kds/all", label: "All orders", hint: "Unified queue · 0 tickets", active: false },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              aria-current={s.active ? "page" : undefined}
              className={`block bg-hansan-surface-raised px-5 py-4 transition hover:bg-hansan-surface-soft ${
                s.active ? "border-t-2 border-t-hansan-orange" : ""
              }`}
            >
              <span className="block text-sm font-black tracking-tight text-hansan-ink">{s.label}</span>
              <span className="mt-0.5 block text-xs text-hansan-ink-muted">{s.hint}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Lifecycle" title="Order states" description="Structural legend from the KDS contract — not live tickets.">
        <div className="flex flex-wrap items-center gap-2 rounded-sm border border-hansan-line bg-hansan-surface-raised px-5 py-4">
          <Badge tone="info">New</Badge>
          <span aria-hidden className="text-hansan-ink-muted">→</span>
          <Badge tone="warning">Preparing</Badge>
          <span aria-hidden className="text-hansan-ink-muted">→</span>
          <Badge tone="success">Ready</Badge>
          <span aria-hidden className="text-hansan-ink-muted">→</span>
          <Badge tone="neutral">Completed</Badge>
          <Link href="/kds/priority" className="ml-auto text-xs font-bold text-hansan-blue hover:underline">
            Triage priority →
          </Link>
        </div>
      </Section>
    </ModulePage>
  );
}


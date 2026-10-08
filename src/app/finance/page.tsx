import Link from "next/link";
import { ModulePage } from "@/components/shared/module-page";
import { Section } from "@/components/ui/section";
import { StatStrip } from "@/components/ui/stat-strip";
import { CatalogIndex } from "@/components/ui/catalog-index";
import { WORKSPACE_SECTION_GROUPS } from "@/config/routes";

/**
 * Finance Overview (Phase 11) — verification layout: money ledger,
 * approvals queue, grouped control index. Zero metrics only (§4).
 */
export default function FinanceOverviewPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Finance" }]}
      title="Finance Overview"
      purpose="Financial command center: today's money movement, what awaits approval, and period summaries."
      status={{
        label: "Rp 0 · 0 transactions",
        detail:
          "No transactions exist, so every figure is a true zero. No calculations, forecasts, or trial numbers are produced in this sprint.",
      }}
      nextAction="After backend launch, POS settlements post here automatically; until then use the directory below to preview each module's structure."
    >
      <Section eyebrow="Ledger" title="Today's money" description="Every figure is a true zero until real postings arrive.">
        <StatStrip
          items={[
            { label: "Net revenue", value: "Rp 0", hint: "No postings" },
            { label: "Transactions", value: "0", hint: "None recorded" },
            { label: "Expenses", value: "Rp 0", hint: "None recorded" },
            { label: "Pending refunds", value: "0", hint: "None requested" },
          ]}
        />
      </Section>

      <Section eyebrow="Approvals" title="Awaiting decision" description="Refunds and adjustments queue here for finance sign-off.">
        <div className="overflow-hidden rounded-sm border border-hansan-line bg-hansan-surface-raised">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="text-sm font-bold text-hansan-ink">Refund queue — 0 open</p>
            <Link href="/finance/refunds" className="text-xs font-bold text-hansan-blue hover:underline">
              Open refunds →
            </Link>
          </div>
          <p className="border-t border-hansan-line px-5 py-4 text-sm text-hansan-ink-muted">
            Nothing awaits approval. Refund requests from POS will appear here with requester, amount, and reason.
          </p>
        </div>
      </Section>

      <Section eyebrow="Directory" title="Finance catalog" description="Movement first, control second — verify daily, close monthly.">
        <CatalogIndex groups={WORKSPACE_SECTION_GROUPS["/finance"] ?? []} />
      </Section>
    </ModulePage>
  );
}


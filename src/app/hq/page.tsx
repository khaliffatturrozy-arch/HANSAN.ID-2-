import { ModulePage } from "@/components/shared/module-page";
import { Section } from "@/components/ui/section";
import { StatStrip } from "@/components/ui/stat-strip";
import { CatalogIndex } from "@/components/ui/catalog-index";
import { Alert } from "@/components/ui/alert";
import { WORKSPACE_SECTION_GROUPS } from "@/config/routes";
import Link from "next/link";

/**
 * HQ Overview (Phase 8) — command layout: stats ledger, onboarding
 * checklist, grouped catalog index. Zero-state metrics only (§4).
 */
export default function HqOverviewPage() {
  return (
    <div>
      <ModulePage
        breadcrumbs={[{ label: "HQ" }]}
        title="HQ Overview"
        purpose="Single back-office control room: performance at a glance, what needs setup, and where each job lives."
        status={{
          label: "Empty workspace",
          tone: "warning",
          detail:
            "This deployment has no business records yet — no outlets, orders, customers, or inventory exist. All metrics intentionally show zero until real data arrives after the backend phase.",
        }}
        nextAction="Start onboarding: set up the catalog in Catalog, then outlets and stock in Inventory. Metrics populate automatically once real records exist."
        actions={
          <Link
            href="/hq/catalog"
            className="inline-flex h-9 items-center justify-center rounded-sm bg-hansan-orange px-4 text-sm font-bold text-white shadow-neu-raised-sm transition hover:brightness-105 focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
          >
            Go to Catalog
          </Link>
        }
      >
        <Section eyebrow="Today" title="Performance ledger" description="True zeros until real records arrive — nothing is estimated.">
          <StatStrip
            items={[
              { label: "Revenue", value: "Rp 0", hint: "Today · no transactions yet" },
              { label: "Orders", value: "0", hint: "Today · no orders yet" },
              { label: "Customers", value: "0", hint: "No customer records yet" },
              { label: "Inventory", value: "0 items", hint: "No stock records yet" },
            ]}
          />
        </Section>

        <Section eyebrow="Setup" title="Onboarding checklist" description="Work top to bottom — every workspace below depends on the catalog.">
          <ol className="grid gap-px overflow-hidden rounded-sm border border-hansan-line bg-hansan-line sm:grid-cols-2">
            {[
              { n: "01", title: "Define the catalog", hint: "Categories → products → modifiers", done: false },
              { n: "02", title: "Open stock", hint: "Items + opening quantities", done: false },
              { n: "03", title: "Staff the floor", hint: "Roles + shifts in Workforce", done: false },
              { n: "04", title: "Run operations", hint: "Tables, orders, and daily control", done: false },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-4 bg-hansan-surface-raised px-5 py-4">
                <span aria-hidden className="font-mono text-xs font-bold text-hansan-orange">{step.n}</span>
                <span>
                  <span className="block text-sm font-bold text-hansan-ink">{step.title}</span>
                  <span className="mt-0.5 block text-xs text-hansan-ink-muted">{step.hint}</span>
                </span>
              </li>
            ))}
          </ol>
          <Alert tone="info" title="Onboarding guidance" className="mt-4">
            HANSAN ships empty by design during the UI/UX sprint. Complete Catalog → Inventory
            → Workforce → Operations to finish structural setup.
          </Alert>
        </Section>

        <Section eyebrow="Catalog" title="HQ directory" description="Every HQ module, grouped by job — operate, offer, supply, organize.">
          <CatalogIndex groups={WORKSPACE_SECTION_GROUPS["/hq"] ?? []} />
        </Section>
      </ModulePage>
    </div>
  );
}


import Link from "next/link";
import { ModulePage } from "@/components/shared/module-page";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { StatStrip } from "@/components/ui/stat-strip";
import { CatalogIndex } from "@/components/ui/catalog-index";
import { WORKSPACE_SECTION_GROUPS } from "@/config/routes";

const HEALTH_CHECKS: { name: string; status: string; tone: "success" | "warning" | "neutral"; detail: string }[] = [
  { name: "Application build", status: "Operational", tone: "success", detail: "Next.js production build serves static pages." },
  { name: "Database", status: "Not configured", tone: "neutral", detail: "No database connection is provisioned during the UI sprint." },
  { name: "API routes", status: "Development mode", tone: "warning", detail: "Only /api/health exists; no business endpoints are implemented." },
  { name: "Integrations", status: "Pending setup", tone: "warning", detail: "No third-party services are connected." },
];

/**
 * Developer — System Health (Phase 12). Honest states only: this page
 * reports what actually exists, never simulated green checks (§4).
 */
export default function DeveloperHealthPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer" }]}
      title="System Health"
      purpose="Live service inventory: what is running, what is stubbed, and what is not configured yet."
      status={{
        label: "Scaffold operational",
        tone: "success",
        detail:
          "The frontend scaffold is healthy. Backend-dependent services intentionally report not-configured instead of pretending to run.",
      }}
      nextAction="Use Environment and Database pages to review setup gaps before the backend phase begins."
    >
      <Section eyebrow="Runtime" title="Service inventory" description="What is running, what is stubbed, what is not configured.">
        <StatStrip
          items={[
            { label: "Scaffold", value: "Live", hint: "Next.js serves pages" },
            { label: "Database", value: "0", hint: "Not provisioned" },
            { label: "API routes", value: "1", hint: "/api/health only" },
            { label: "Integrations", value: "0", hint: "None connected" },
          ]}
        />
        <div className="mt-4 overflow-hidden rounded-sm border border-hansan-line bg-hansan-surface-raised">
          {HEALTH_CHECKS.map((check) => (
            <div key={check.name} className="flex flex-wrap items-center justify-between gap-3 border-b border-hansan-line px-5 py-3.5 last:border-b-0">
              <div>
                <p className="text-sm font-bold text-hansan-ink">{check.name}</p>
                <p className="mt-0.5 text-xs text-hansan-ink-muted">{check.detail}</p>
              </div>
              <Badge tone={check.tone}>{check.status}</Badge>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Gaps" title="Setup queue" description="Close these before the backend phase begins.">
        <div className="grid gap-px overflow-hidden rounded-sm border border-hansan-line bg-hansan-line sm:grid-cols-2">
          {[
            { href: "/developer/environment", title: "Review environment", hint: "Flags, origins, dev accounts" },
            { href: "/developer/database", title: "Provision database", hint: "Connection + migrations" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group block bg-hansan-surface-raised px-5 py-4 transition hover:bg-hansan-surface-soft">
              <span className="block text-sm font-bold text-hansan-ink group-hover:underline group-hover:decoration-hansan-orange group-hover:underline-offset-4">
                {item.title} →
              </span>
              <span className="mt-0.5 block text-xs text-hansan-ink-muted">{item.hint}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Directory" title="Developer catalog" description="Runtime first, governance second.">
        <CatalogIndex groups={WORKSPACE_SECTION_GROUPS["/developer"] ?? []} />
      </Section>
    </ModulePage>
  );
}

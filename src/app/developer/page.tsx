import { ModulePage } from "@/components/shared/module-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
      <div className="mb-6 grid gap-3">
        {HEALTH_CHECKS.map((check) => (
          <Card key={check.name} padding="sm" elevation="flat" className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-hansan-ink">{check.name}</p>
              <p className="text-xs text-hansan-ink-muted">{check.detail}</p>
            </div>
            <Badge tone={check.tone}>{check.status}</Badge>
          </Card>
        ))}
      </div>
    </ModulePage>
  );
}

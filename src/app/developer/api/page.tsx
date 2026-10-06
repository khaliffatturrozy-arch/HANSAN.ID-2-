import { ModulePage } from "@/components/shared/module-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function DeveloperApiPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer", href: "/developer" }, { label: "API" }]}
      title="API"
      purpose="HTTP surface inventory: registered routes, methods, and their availability."
      status={{
        label: "Development mode",
        tone: "warning",
        detail:
          "Only GET /api/health exists, returning honest not-configured states. No business endpoints are implemented — none are faked either.",
      }}
      nextAction="Business endpoints are designed and built during the backend phase; this registry will list them as they ship."
    >
      <div className="mb-6">
        <Card padding="sm" elevation="flat" className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-sm font-semibold text-hansan-ink">GET /api/health</p>
            <p className="text-xs text-hansan-ink-muted">
              Service status probe — static honest responses, no side effects.
            </p>
          </div>
          <Badge tone="success">Available</Badge>
        </Card>
      </div>
    </ModulePage>
  );
}

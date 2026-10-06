import { ModulePage } from "@/components/shared/module-page";
import { Alert } from "@/components/ui/alert";

/** KDS — Priority: overdue/flagged tickets only. Empty initially. */
export default function KdsPriorityPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "KDS", href: "/kds" }, { label: "Priority" }]}
      title="Priority"
      purpose="Escalation lane: tickets breaching prep-time targets or manually flagged urgent."
      status={{
        label: "Nothing escalated",
        detail:
          "No tickets are overdue or flagged — with zero tickets in the system, the priority lane is correctly empty.",
      }}
      nextAction="Prep-time thresholds will be configurable in HQ → Settings; breaches will surface here automatically."
    >
      <Alert tone="info" title="How prioritization will work">
        Each ticket age is measured against the configured target prep time.
        Breaches move the ticket into this lane with a visual escalation marker.
      </Alert>
    </ModulePage>
  );
}

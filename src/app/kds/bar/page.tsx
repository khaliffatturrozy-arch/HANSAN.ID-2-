import { ModulePage } from "@/components/shared/module-page";

/** KDS — Bar view. Empty until POS sends drink tickets. */
export default function KdsBarPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "KDS", href: "/kds" }, { label: "Bar" }]}
      title="Bar"
      purpose="Bar ticket board: beverage and barista orders, separated from the kitchen queue."
      status={{
        label: "No active orders",
        detail:
          "No bar tickets are queued. The board reads only from real POS orders — nothing is simulated.",
      }}
      nextAction="Bar items tagged in the catalog route here once POS → KDS wiring is live (post-freeze backend)."
      actionLabel="Back to kitchen"
      actionHref="/kds"
    />
  );
}

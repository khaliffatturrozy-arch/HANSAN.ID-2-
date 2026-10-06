import { ModulePage } from "@/components/shared/module-page";

/**
 * Step 6 — receipt. No completed transaction exists, so no receipt is
 * rendered. Never shows a fabricated receipt (§4).
 */
export default function PosReceiptPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "POS", href: "/pos" }, { label: "Receipt" }]}
      title="Receipt"
      purpose="Post-payment receipt view: print, email, or re-issue the last completed order."
      status={{
        label: "No receipt available",
        detail:
          "No transaction has been completed in this session, so there is no receipt to show. Receipts are only generated from real paid orders.",
      }}
      nextAction="Complete an order through payment (once items and processing exist) and the latest receipt appears here automatically."
      actionLabel="Back to POS home"
      actionHref="/pos"
    />
  );
}

import { ModulePage } from "@/components/shared/module-page";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Step 3 — menu selection. Catalog is empty (HQ → Catalog not populated),
 * so the menu honestly shows zero categories. No products are invented (§4).
 */
export default function PosMenuPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "POS", href: "/pos" }, { label: "Menu" }]}
      title="Menu"
      purpose="Product grid for building the current order: categories, items, modifiers, and add-to-cart."
      status={{
        label: "0 categories · 0 items",
        tone: "warning",
        detail:
          "The catalog has not been populated yet, so the menu grid is empty. Nothing is fabricated — real products appear here once HQ → Catalog is filled in.",
      }}
      nextAction="Populate the catalog in HQ → Catalog (owner role), then return here to ring up items. The cart step can be reviewed now."
      actionLabel="Review cart"
      actionHref="/pos/cart"
    >
      <EmptyState
        title="Menu is empty"
        description="Categories and products from the HQ catalog will render as tappable tiles here."
      />
    </ModulePage>
  );
}

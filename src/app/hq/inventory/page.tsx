import { ModulePage } from "@/components/shared/module-page";

export default function HqInventoryPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Inventory" }]}
      title="Inventory"
      purpose="Stock control: items, stock levels, low-stock alerts, and movement history across outlets."
      status={{
        label: "0 items",
        detail:
          "No stock items or movements are recorded. Counts show zero because no inventory exists in this environment.",
      }}
      nextAction="After the catalog is set up, define stock items and opening quantities to activate low-stock monitoring."
    />
  );
}

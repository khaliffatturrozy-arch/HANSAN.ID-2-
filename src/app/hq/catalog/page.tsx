import { ModulePage } from "@/components/shared/module-page";

export default function HqCatalogPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Catalog" }]}
      title="Catalog"
      purpose="Product master: categories, products, modifiers, pricing, and availability that feed POS and KDS."
      status={{
        label: "0 products",
        detail:
          "The catalog is empty — no categories or products exist yet. POS menu and KDS tickets will read from this catalog once it is populated (post-freeze backend).",
      }}
      nextAction="Design the category → product → modifier hierarchy here first; every other workspace depends on this catalog."
    />
  );
}

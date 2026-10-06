import { ModulePage } from "@/components/shared/module-page";

export default function DeveloperDatabasePage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer", href: "/developer" }, { label: "Database" }]}
      title="Database"
      purpose="Data-layer status: schema state, migrations, and connection health."
      status={{
        label: "Not configured",
        detail:
          "No database provider is connected. Prisma/Supabase provisioning is deferred until after UI/UX freeze (§23–§24) — no schema is mocked.",
      }}
      nextAction="During the backend phase, choose the provider, run the first migration, and this page will report real connection status."
    />
  );
}

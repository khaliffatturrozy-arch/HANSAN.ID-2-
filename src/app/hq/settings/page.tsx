import { ModulePage } from "@/components/shared/module-page";

export default function HqSettingsPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Settings" }]}
      title="Settings"
      purpose="Workspace configuration: outlets, tax rules, receipt templates, roles, and preferences."
      status={{
        label: "Defaults only",
        detail:
          "Running on scaffold defaults. No outlets, tax profiles, or branded receipts are configured yet.",
      }}
      nextAction="Configure outlets and tax rules here first — most other modules inherit these settings."
    />
  );
}

import { ModulePage } from "@/components/shared/module-page";

export default function DeveloperConfigurationPage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "Developer", href: "/developer" }, { label: "Configuration" }]}
      title="Configuration"
      purpose="Feature flags, build options, and runtime toggles that control the application surface."
      status={{
        label: "Scaffold defaults",
        detail:
          "All flags are at scaffold defaults. No feature flags are toggled, and no runtime configuration is loaded from a server.",
      }}
      nextAction="Flag definitions will be introduced alongside backend features; toggling happens here without redeploying."
    />
  );
}

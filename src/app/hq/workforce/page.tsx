import { ModulePage } from "@/components/shared/module-page";

export default function HqWorkforcePage() {
  return (
    <ModulePage
      breadcrumbs={[{ label: "HQ", href: "/hq" }, { label: "Workforce" }]}
      title="Workforce"
      purpose="Staff management: employee records, roles, shifts, and attendance per outlet."
      status={{
        label: "0 employees",
        detail:
          "No employee records exist. The five development sign-in accounts are UI identities only and are not staff records.",
      }}
      nextAction="After backend launch, import employees and assign POS/KDS shifts to activate scheduling."
    />
  );
}

import * as React from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export interface ModuleStatus {
  /** Short machine label, e.g. "Not configured", "0 records". */
  label: string;
  tone?: BadgeTone;
  /** One sentence describing why the status is what it is. */
  detail: string;
}

export interface ModulePageProps {
  breadcrumbs: Crumb[];
  title: string;
  /** What this module does (required by workspace rules). */
  purpose: string;
  /** Current honest status (required). */
  status: ModuleStatus;
  /** Next action guidance (required) — how the user advances. */
  nextAction: string;
  /** Optional next-action button rendered inside EmptyState. */
  actionLabel?: string;
  onAction?: () => void;
  /** Link-based action — use from server components. */
  actionHref?: string;
  /** Right-aligned page actions. */
  actions?: React.ReactNode;
  /** Extra UI under the header: KPI grids, skeletons, sub-panels. */
  children?: React.ReactNode;
}

/**
 * Standard module page scaffold — every workspace page renders through
 * this so all three required explanations are present:
 *   1) what this module does, 2) current status, 3) next action.
 * Uses Breadcrumb + PageHeader + EmptyState per workspace rules (§4:
 * honest states only, no fabricated business data).
 */
export function ModulePage({
  breadcrumbs,
  title,
  purpose,
  status,
  nextAction,
  actionLabel,
  onAction,
  actionHref,
  actions,
  children,
}: ModulePageProps) {
  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      <PageHeader title={title} description={purpose} actions={actions} />

      {children}

      <div className="mt-2 rounded-sm border border-hansan-line bg-hansan-surface-raised">
        <div className="flex flex-wrap items-center gap-3 border-b border-hansan-line px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hansan-ink-muted">
            Current status
          </p>
          <Badge tone={status.tone ?? "neutral"}>{status.label}</Badge>
        </div>
        <p className="px-5 py-3 text-sm leading-relaxed text-hansan-ink-muted">{status.detail}</p>
      </div>

      <EmptyState
        className="mt-4"
        title="Next action"
        description={nextAction}
        actionLabel={actionLabel}
        actionHref={actionHref}
        onAction={onAction}
      />
    </div>
  );
}

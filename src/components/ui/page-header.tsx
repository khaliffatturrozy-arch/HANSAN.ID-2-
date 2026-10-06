import * as React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-aligned actions (buttons). */
  actions?: React.ReactNode;
  /** Rendered below the title row (filters, tabs). */
  children?: React.ReactNode;
  className?: string;
}

/** Standard page header used by every workspace page (Phase 6). */
export function PageHeader({ title, description, actions, children, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-6 ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-hansan-ink">{title}</h1>
          {description && <p className="mt-1 text-sm text-hansan-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

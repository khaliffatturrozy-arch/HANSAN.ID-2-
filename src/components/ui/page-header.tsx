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

/** Standard page header: editorial rule + tight hierarchy (design direction). */
export function PageHeader({ title, description, actions, children, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-6 border-b-2 border-hansan-ink pb-5 ${className}`.trim()}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-black tracking-tight text-hansan-ink">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-hansan-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

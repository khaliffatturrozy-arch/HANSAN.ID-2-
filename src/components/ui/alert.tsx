import * as React from "react";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
}

const TONE_CLASS: Record<AlertTone, string> = {
  info: "border-hansan-blue/30 bg-hansan-blue/5 text-hansan-blue",
  success: "border-hansan-success/30 bg-hansan-success/5 text-hansan-success",
  warning: "border-hansan-warning/30 bg-hansan-warning/5 text-hansan-warning",
  danger: "border-hansan-danger/30 bg-hansan-danger/5 text-hansan-danger",
};

/** Inline alert banner — messaging/UI states only. */
export function Alert({ tone = "info", title, className = "", children, ...rest }: AlertProps) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${TONE_CLASS[tone]} ${className}`.trim()} {...rest}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      <div className={title ? "opacity-90" : undefined}>{children}</div>
    </div>
  );
}

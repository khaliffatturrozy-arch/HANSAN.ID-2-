import * as React from "react";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastItem {
  id: string;
  message: string;
  tone?: ToastTone;
}

export interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const TONE_CLASS: Record<ToastTone, string> = {
  info: "border-l-hansan-blue",
  success: "border-l-hansan-success",
  warning: "border-l-hansan-warning",
  danger: "border-l-hansan-danger",
};

/** Toast stack — feedback channel only, never business data (§4). */
export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-toast flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`flex items-start justify-between gap-3 rounded-sm border border-hansan-line border-l-4 bg-hansan-surface-raised px-4 py-3 shadow-neu-raised ${TONE_CLASS[t.tone ?? "info"]}`}
        >
          <p className="text-sm text-hansan-ink">{t.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(t.id)}
            className="rounded-md text-hansan-ink-muted hover:text-hansan-ink"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

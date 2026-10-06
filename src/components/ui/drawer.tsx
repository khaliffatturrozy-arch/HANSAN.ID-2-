import * as React from "react";
import { Button } from "./button";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  side?: "right" | "left";
}

/** Slide-over drawer for secondary flows (filters, detail panels). */
export function Drawer({ open, onClose, title, children, side = "right" }: DrawerProps) {
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-drawer" role="presentation">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-hansan-ink/30"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-hansan-surface-soft shadow-neu-raised ${side === "right" ? "right-0" : "left-0"}`}
      >
        <div className="flex items-center justify-between border-b border-hansan-line p-4">
          <h2 id={titleId} className="text-base font-bold text-hansan-ink">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close panel">
            ✕
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </aside>
    </div>
  );
}

// src/demos/_shared/Dialog.tsx
//
// Centered modal primitive (E.3). Distinct from Sheet (which is a right-side
// drawer). Two consumers in this iteration:
//   - taxai-talk E.5 (Conclusion modal after voice session ends)
//   - taxai-chat E.12 (Change Plan picker)
//
// z-50 (below MobileViewportNotice z-100 so mobile users see both correctly).
// Escape closes; click-outside on backdrop closes; no focus trap (prototype).

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 480,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Optional pinned footer area (e.g. action buttons). */
  footer?: ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // E.18 polish — block body scroll while modal is open (mobile-friendly).
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const titleId = title ? "dialog-title" : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full overflow-hidden rounded-lg border shadow-2xl"
        style={{
          maxWidth: `${maxWidth}px`,
          backgroundColor: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--fg)",
          maxHeight: "calc(100vh - 2rem)",
        }}
      >
        {title && (
          <header
            className="flex h-12 items-center gap-2 border-b px-4"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 id={titleId} className="text-sm font-semibold">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:opacity-80"
              style={{ color: "var(--muted)" }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </header>
        )}
        <div
          className="overflow-y-auto p-5"
          style={{ maxHeight: footer ? "calc(100vh - 3rem - 4rem)" : "calc(100vh - 3rem)" }}
        >
          {children}
        </div>
        {footer && (
          <div
            className="flex items-center justify-end gap-2 border-t px-4 py-3"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
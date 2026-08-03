// src/demos/_shared/Sheet.tsx
import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Sheet({
  open,
  onClose,
  title,
  children,
  width = 420,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="relative h-full border-l"
        style={{
          width,
          backgroundColor: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        <header
          className="flex h-12 items-center gap-2 border-b px-3"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--surface)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}

// src/demos/_shared/MobileViewportNotice.tsx
//
// One-time, dismissible notice shown on small screens telling visitors the
// prototype experience is tuned for desktop. Mounted once in router.tsx so
// it covers all 5 demos regardless of whether they use the shared Shell.

import { useEffect, useState } from "react";
import { Monitor, X } from "lucide-react";

const DISMISS_KEY = "demo-mobile-notice-dismissed";

export function MobileViewportNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const check = () => setVisible(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/20 p-4 sm:items-center"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
            <Monitor className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-neutral-900">
              Tampilan terbaik di layar besar
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
              Prototype ini dirancang untuk pengalaman desktop. Anda tetap
              bisa menjelajahinya di sini, tapi tampilannya akan lebih
              maksimal di layar yang lebih besar.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Tutup"
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="mt-4 w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Mengerti, lanjutkan
        </button>
      </div>
    </div>
  );
}

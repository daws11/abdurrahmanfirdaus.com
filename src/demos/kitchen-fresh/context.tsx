// src/demos/kitchen-fresh/context.tsx
//
// Shared context for the Kitchen Fresh demo screens. Provides:
//   - the currently active outlet (set by OutletSwitcher)
//   - a setter to switch outlet
//   - a mutable map of prep items keyed by id, so DailyOps can cycle status
//
// All state lives in this provider — no real backend, no fetch.

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { OutletId } from "@/demos/_shared/fixtures/inventory";
import { PREP_ITEMS, type PrepItem, type PrepStatus } from "./mocks";

export interface KitchenFreshContextValue {
  activeOutletId: OutletId;
  setActiveOutlet: (id: OutletId) => void;
  prepItems: PrepItem[];
  cyclePrepStatus: (id: string) => void;
  /** Reset a single prep item to "ready to start" (empty). */
  resetPrepItem: (id: string) => void;
  /** "Start" a prep item — flips pending → in-progress and starts a fresh timer. */
  startPrepItem: (id: string) => void;
}

const KitchenFreshContext = createContext<KitchenFreshContextValue | null>(null);

export function KitchenFreshProvider({
  initialOutletId = "O1",
  children,
}: {
  initialOutletId?: OutletId;
  children: ReactNode;
}) {
  const [activeOutletId, setActiveOutletId] = useState<OutletId>(initialOutletId);
  const [prepItems, setPrepItems] = useState<PrepItem[]>(() => PREP_ITEMS);

  const value = useMemo<KitchenFreshContextValue>(
    () => ({
      activeOutletId,
      setActiveOutlet: setActiveOutletId,
      prepItems,
      cyclePrepStatus: (id: string) => {
        setPrepItems((rows) =>
          rows.map((r) => {
            if (r.id !== id) return r;
            const next = nextStatus(r.status);
            return {
              ...r,
              status: next,
              currentCount:
                next === "done"
                  ? r.parLevel
                  : next === "in-progress"
                    ? Math.max(0, Math.floor(r.parLevel / 2))
                    : 0,
              ageMinutes:
                next === "pending"
                  ? 0
                  : next === "in-progress"
                    ? 1
                    : r.ageMinutes,
            };
          }),
        );
      },
      resetPrepItem: (id: string) => {
        setPrepItems((rows) =>
          rows.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "pending",
                  ageMinutes: 0,
                  currentCount: 0,
                }
              : r,
          ),
        );
      },
      startPrepItem: (id: string) => {
        setPrepItems((rows) =>
          rows.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "in-progress",
                  ageMinutes: 1,
                  currentCount: Math.max(0, Math.floor(r.parLevel / 2)),
                }
              : r,
          ),
        );
      },
    }),
    [activeOutletId, prepItems],
  );

  return (
    <KitchenFreshContext.Provider value={value}>{children}</KitchenFreshContext.Provider>
  );
}

export function useKitchenFresh(): KitchenFreshContextValue {
  const ctx = useContext(KitchenFreshContext);
  if (!ctx) {
    throw new Error("useKitchenFresh must be used within <KitchenFreshProvider>");
  }
  return ctx;
}

function nextStatus(s: PrepStatus): PrepStatus {
  switch (s) {
    case "pending":
      return "in-progress";
    case "in-progress":
      return "done";
    case "done":
      return "pending";
  }
}
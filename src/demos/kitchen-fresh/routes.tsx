// src/demos/kitchen-fresh/routes.tsx
//
// Typed sub-routes for the Kitchen Fresh demo. URL shape:
//   #/demos/kitchen-fresh           — OutletSwitcher (default landing)
//   #/demos/kitchen-fresh/daily     — DailyOps (prep checklist)
//   #/demos/kitchen-fresh/stock     — StockCheck (per-outlet stock checklist)
//   #/demos/kitchen-fresh/handoff   — ShiftHandoff (outgoing/incoming notes)
//
// The router in src/demos/router.tsx parses the URL and passes `sub` to the
// KitchenFresh component, which switches on it via `getScreenLabel` below.

export type KitchenFreshScreen =
  | "outlets"
  | "daily"
  | "stock"
  | "handoff";

export const KITCHEN_FRESH_SCREENS: {
  id: KitchenFreshScreen;
  label: string;
}[] = [
  { id: "outlets", label: "Outlets" },
  { id: "daily", label: "Daily Ops" },
  { id: "stock", label: "Stock Check" },
  { id: "handoff", label: "Shift Handoff" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: KitchenFreshScreen,
): KitchenFreshScreen {
  if (!sub) return fallback;
  const found = KITCHEN_FRESH_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as KitchenFreshScreen;
}

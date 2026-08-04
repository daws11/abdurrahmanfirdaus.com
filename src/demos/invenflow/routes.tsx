// src/demos/invenflow/routes.tsx
//
// Typed sub-routes for the Invenflow demo. URL shape: #/demos/invenflow/{screen}.

export type InvenflowScreen =
  | "purchasing"
  | "receiving"
  | "stocktake"
  | "inventory"
  | "movement";

export const INVENFLOW_SCREENS: {
  id: InvenflowScreen;
  label: string;
  hint?: string;
}[] = [
  { id: "purchasing", label: "Purchasing", hint: "Kanban — New → Approve → Purchase → Received" },
  { id: "receiving", label: "Receiving", hint: "Confirm incoming stock" },
  { id: "stocktake", label: "Stocktake", hint: "Edit actual counts per location" },
  { id: "inventory", label: "Inventory", hint: "Stock by location snapshot" },
  { id: "movement", label: "Movement", hint: "Recent stock transfers and write-offs" },
];

export function getInvenflowScreen(sub: string | null): InvenflowScreen {
  if (!sub) return "purchasing";
  const found = INVENFLOW_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? "purchasing") as InvenflowScreen;
}
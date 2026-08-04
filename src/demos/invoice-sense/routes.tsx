// src/demos/invoice-sense/routes.tsx
//
// Typed sub-routes for the Invoice Sense demo. URL shape:
// #/demos/invoice-sense/{screen}.

export type InvoiceSenseScreen = "inbox" | "reconciliation" | "suppliers" | "analytics";

export const INVOICE_SENSE_SCREENS: {
  id: InvoiceSenseScreen;
  label: string;
}[] = [
  { id: "inbox", label: "Inbox" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "suppliers", label: "Suppliers" },
  { id: "analytics", label: "Analytics" },
];

export function getInvoiceSenseScreen(
  sub: string | null,
  fallback: InvoiceSenseScreen,
): InvoiceSenseScreen {
  if (!sub) return fallback;
  const found = INVOICE_SENSE_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as InvoiceSenseScreen;
}
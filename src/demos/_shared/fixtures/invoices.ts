// src/demos/_shared/fixtures/invoices.ts
//
// Synthetic invoice fixtures. Per-app plans extend with richer data.

export type InvoiceStatus = "matched" | "mismatch" | "pending";
export interface InvoiceLine { sku: string; qty: number; unitPrice: number; total: number; }
export interface Invoice {
  id: string;
  vendor: string;
  date: string;
  dueDate: string;
  lines: InvoiceLine[];
  status: InvoiceStatus;
  mismatchField?: "qty" | "price" | "total" | "sku";
}
export const INVOICES: Invoice[] = [];

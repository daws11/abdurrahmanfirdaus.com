// src/demos/invoice-sense/mocks.ts
//
// Synthetic fixtures for the Invoice Sense demo. All vendor names, invoice
// numbers, SKUs, and amounts are invented. Built fresh from the case-study
// copy in `src/data/portfolio.ts` and standard placeholders. No real data is
// reused from the production app.
//
// Distribution target: most invoices matched, ~25% mismatch, a small subset
// pending review. The fixtures intentionally span all 5 outlets + the
// warehouse and the 12 SKUs from the shared inventory fixture.

import type { OutletId } from "@/demos/_shared/fixtures/inventory";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InvoiceStatus = "matched" | "mismatch" | "pending";
export type MismatchField = "qty" | "price" | "total" | "sku" | null;

export interface InvoiceLine {
  /** SKU code (matches `SKUS` in inventory fixture). */
  sku: string;
  /** Display name of the SKU at the time of purchase. */
  desc: string;
  qty: number;
  unitPrice: number;
  total: number;
  /** Unit of measure (kg, L, pcs, etc.). */
  unit: string;
}

export interface StockEntry {
  sku: string;
  outlet: OutletId;
  /** Quantity recorded by the receiving log. */
  loggedQty: number;
  /** Quantity claimed by the invoice. */
  invoicedQty: number;
}

export interface Invoice {
  id: string;
  /** Production's "Invoice #" field — same value as `id` for the demo. */
  invoiceNumber?: string;
  vendor: string;
  vendorCode: string;
  /** Whether the supplier is marked as on the reconcile list. */
  reconcile: boolean;
  date: string;
  dueDate: string;
  currency: string;
  /** Subtotal before tax. */
  subtotal: number;
  tax: number;
  total: number;
  lines: InvoiceLine[];
  status: InvoiceStatus;
  /** Which field disagrees — only present when status === "mismatch". */
  mismatchField?: MismatchField;
  /** OCR confidence score, 0-100. */
  confidence: number;
  /** Source channel: e.g. "manual_upload", "whatsapp", "inventory_webhook". */
  source: "manual_upload" | "whatsapp" | "inventory_webhook" | "google_drive" | "ecommerce";
  /** Optional human-readable payment type. */
  paymentType: "cash_central" | "cash_outlet" | "transfer";
  /** Reconciliation status mirror. */
  reconcileStatus: "confirmed" | "needs_review" | "unreconciled";
  /** Tag the user has placed on the invoice (matches production custom tags). */
  customTag: "matching" | "review" | "delete" | "payment_request";
}

export interface SupplierMapping {
  vendorCode: string;
  vendorName: string;
  accountingCode: string;
  taxId: string;
  contact: string;
  active: boolean;
  lastInvoice: string;
  paymentTerm: string;
  currency: string;
  /** Whether this supplier auto-reconciles against the inventory log. */
  reconcile: boolean;
}

// ---------------------------------------------------------------------------
// Vendor pool — 24 generic public-pool names
// ---------------------------------------------------------------------------

export const VENDORS: { code: string; name: string }[] = [
  { code: "AC", name: "Acme Coffee Roasters" },
  { code: "BB", name: "Blue Bottle Beans" },
  { code: "CB", name: "Crimson Bakery" },
  { code: "DS", name: "Delta Syrups" },
  { code: "EM", name: "Eden Mills" },
  { code: "FA", name: "Fairfield Agriculture" },
  { code: "GB", name: "Goldleaf Beverages" },
  { code: "HC", name: "Harbor Coffee Co." },
  { code: "IM", name: "Indigo Mfg." },
  { code: "JL", name: "Jade Leaf Tea" },
  { code: "KP", name: "Kingfisher Produce" },
  { code: "LM", name: "Lakeside Dairy" },
  { code: "MR", name: "Meridian Roasters" },
  { code: "NS", name: "Northstar Spices" },
  { code: "OC", name: "Orbit Cups" },
  { code: "PC", name: "Pacific Commodities" },
  { code: "QR", name: "Quartet Packaging" },
  { code: "RG", name: "Riverside Grains" },
  { code: "SP", name: "Sunlit Pastries" },
  { code: "TS", name: "Tideline Seafood" },
  { code: "UP", name: "Upland Farms" },
  { code: "VB", name: "Verdant Botanicals" },
  { code: "WR", name: "Whitman Refinery" },
  { code: "YS", name: "Yokoyama Supplies" },
];

// ---------------------------------------------------------------------------
// SKU index — mirrors inventory fixture; data fixtures reuse these
// ---------------------------------------------------------------------------

export const SKU_INDEX: Record<string, { name: string; unit: string }> = {
  "SKU-001": { name: "House Beans 1kg", unit: "kg" },
  "SKU-002": { name: "Oat Milk 1L", unit: "L" },
  "SKU-003": { name: "Cane Sugar 1kg", unit: "kg" },
  "SKU-004": { name: "Branding Stickers", unit: "roll" },
  "SKU-005": { name: "Branding Cups 12oz", unit: "pcs" },
  "SKU-006": { name: "Espresso Machine Pro", unit: "unit" },
  "SKU-007": { name: "Grinder 64mm", unit: "unit" },
  "SKU-008": { name: "Cleaning Tablets", unit: "pcs" },
  "SKU-009": { name: "Napkin Bulk Pack", unit: "pack" },
  "SKU-010": { name: "Almond Flour 500g", unit: "kg" },
  "SKU-011": { name: "Cocoa Powder 500g", unit: "kg" },
  "SKU-012": { name: "Vanilla Syrup 750ml", unit: "L" },
};

// ---------------------------------------------------------------------------
// Synthetic invoices — 50 rows spanning statuses, dates, vendors, and stores
// ---------------------------------------------------------------------------

// Helper: build a line with consistent math.
function line(sku: string, qty: number, unitPrice: number): InvoiceLine {
  const meta = SKU_INDEX[sku] ?? { name: sku, unit: "pcs" };
  return {
    sku,
    desc: meta.name,
    qty,
    unitPrice,
    total: Number((qty * unitPrice).toFixed(2)),
    unit: meta.unit,
  };
}

// Build a deterministic synthetic dataset. Invoices are ordered by date desc
// (most recent first) to match the production default sort.
export const INVOICES: Invoice[] = [
  // ============================================================
  // Today batch — 2026-08-04 (4 invoices)
  // ============================================================
  {
    id: "INV-2026-048",
    vendor: "Acme Coffee Roasters",
    vendorCode: "AC",
    reconcile: true,
    date: "2026-08-04",
    dueDate: "2026-09-03",
    currency: "USD",
    subtotal: 1842.5,
    tax: 184.25,
    total: 2026.75,
    status: "matched",
    confidence: 98,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 80, 14.5),
      line("SKU-002", 50, 3.8),
      line("SKU-005", 60, 0.85),
    ],
  },
  {
    id: "INV-2026-047",
    vendor: "Blue Bottle Beans",
    vendorCode: "BB",
    reconcile: true,
    date: "2026-08-04",
    dueDate: "2026-09-03",
    currency: "USD",
    subtotal: 720.0,
    tax: 72.0,
    total: 792.0,
    status: "matched",
    confidence: 96,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [line("SKU-001", 40, 18.0), line("SKU-003", 60, 2.0)],
  },
  {
    id: "INV-2026-046",
    vendor: "Eden Mills",
    vendorCode: "EM",
    reconcile: false,
    date: "2026-08-04",
    dueDate: "2026-09-03",
    currency: "USD",
    subtotal: 384.0,
    tax: 38.4,
    total: 422.4,
    status: "pending",
    confidence: 84,
    source: "manual_upload",
    paymentType: "cash_central",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-002", 40, 3.6),
      line("SKU-012", 20, 13.2),
    ],
  },
  {
    id: "INV-2026-045",
    vendor: "Crimson Bakery",
    vendorCode: "CB",
    reconcile: false,
    date: "2026-08-04",
    dueDate: "2026-09-03",
    currency: "USD",
    subtotal: 162.0,
    tax: 16.2,
    total: 178.2,
    status: "matched",
    confidence: 91,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [line("SKU-003", 30, 2.4), line("SKU-010", 12, 7.5)],
  },

  // ============================================================
  // Yesterday batch — 2026-08-03 (5 invoices)
  // ============================================================
  {
    id: "INV-2026-044",
    vendor: "Delta Syrups",
    vendorCode: "DS",
    reconcile: true,
    date: "2026-08-03",
    dueDate: "2026-09-02",
    currency: "USD",
    subtotal: 920.0,
    tax: 92.0,
    total: 1012.0,
    status: "mismatch",
    mismatchField: "qty",
    confidence: 71,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-012", 36, 13.5),
      line("SKU-002", 80, 3.55),
    ],
  },
  {
    id: "INV-2026-043",
    vendor: "Sunlit Pastries",
    vendorCode: "SP",
    reconcile: false,
    date: "2026-08-03",
    dueDate: "2026-09-02",
    currency: "USD",
    subtotal: 248.0,
    tax: 24.8,
    total: 272.8,
    status: "matched",
    confidence: 95,
    source: "manual_upload",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-010", 18, 7.0),
      line("SKU-011", 12, 6.4),
      line("SKU-003", 16, 2.5),
    ],
  },
  {
    id: "INV-2026-042",
    vendor: "Fairfield Agriculture",
    vendorCode: "FA",
    reconcile: true,
    date: "2026-08-03",
    dueDate: "2026-09-02",
    currency: "USD",
    subtotal: 6120.0,
    tax: 612.0,
    total: 6732.0,
    status: "mismatch",
    mismatchField: "price",
    confidence: 64,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-006", 2, 2400.0),
      line("SKU-007", 4, 480.0),
    ],
  },
  {
    id: "INV-2026-041",
    vendor: "Goldleaf Beverages",
    vendorCode: "GB",
    reconcile: true,
    date: "2026-08-03",
    dueDate: "2026-09-02",
    currency: "USD",
    subtotal: 158.5,
    tax: 15.85,
    total: 174.35,
    status: "matched",
    confidence: 94,
    source: "inventory_webhook",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 18, 3.5),
      line("SKU-008", 60, 0.55),
    ],
  },
  {
    id: "INV-2026-040",
    vendor: "Jade Leaf Tea",
    vendorCode: "JL",
    reconcile: false,
    date: "2026-08-03",
    dueDate: "2026-09-02",
    currency: "USD",
    subtotal: 290.0,
    tax: 29.0,
    total: 319.0,
    status: "pending",
    confidence: 81,
    source: "whatsapp",
    paymentType: "cash_central",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-001", 15, 14.0),
      line("SKU-012", 8, 12.5),
    ],
  },

  // ============================================================
  // 2026-08-02 (4 invoices)
  // ============================================================
  {
    id: "INV-2026-039",
    vendor: "Harbor Coffee Co.",
    vendorCode: "HC",
    reconcile: true,
    date: "2026-08-02",
    dueDate: "2026-09-01",
    currency: "USD",
    subtotal: 3780.0,
    tax: 378.0,
    total: 4158.0,
    status: "matched",
    confidence: 97,
    source: "inventory_webhook",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 200, 14.4),
      line("SKU-008", 1000, 0.55),
      line("SKU-005", 480, 0.85),
    ],
  },
  {
    id: "INV-2026-038",
    vendor: "Indigo Mfg.",
    vendorCode: "IM",
    reconcile: false,
    date: "2026-08-02",
    dueDate: "2026-09-01",
    currency: "USD",
    subtotal: 412.0,
    tax: 41.2,
    total: 453.2,
    status: "mismatch",
    mismatchField: "total",
    confidence: 58,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-004", 20, 6.25),
      line("SKU-009", 50, 4.1),
    ],
  },
  {
    id: "INV-2026-037",
    vendor: "Kingfisher Produce",
    vendorCode: "KP",
    reconcile: false,
    date: "2026-08-02",
    dueDate: "2026-09-01",
    currency: "USD",
    subtotal: 196.0,
    tax: 19.6,
    total: 215.6,
    status: "matched",
    confidence: 92,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-010", 12, 8.0),
      line("SKU-011", 8, 11.5),
      line("SKU-003", 12, 1.8),
    ],
  },
  {
    id: "INV-2026-036",
    vendor: "Lakeside Dairy",
    vendorCode: "LM",
    reconcile: true,
    date: "2026-08-02",
    dueDate: "2026-09-01",
    currency: "USD",
    subtotal: 1140.0,
    tax: 114.0,
    total: 1254.0,
    status: "matched",
    confidence: 96,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [line("SKU-002", 300, 3.8)],
  },

  // ============================================================
  // 2026-08-01 (4 invoices)
  // ============================================================
  {
    id: "INV-2026-035",
    vendor: "Meridian Roasters",
    vendorCode: "MR",
    reconcile: true,
    date: "2026-08-01",
    dueDate: "2026-08-31",
    currency: "USD",
    subtotal: 2900.0,
    tax: 290.0,
    total: 3190.0,
    status: "matched",
    confidence: 98,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 200, 14.5),
    ],
  },
  {
    id: "INV-2026-034",
    vendor: "Northstar Spices",
    vendorCode: "NS",
    reconcile: false,
    date: "2026-08-01",
    dueDate: "2026-08-31",
    currency: "USD",
    subtotal: 215.0,
    tax: 21.5,
    total: 236.5,
    status: "matched",
    confidence: 93,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-003", 25, 2.5),
      line("SKU-011", 12, 11.25),
    ],
  },
  {
    id: "INV-2026-033",
    vendor: "Orbit Cups",
    vendorCode: "OC",
    reconcile: false,
    date: "2026-08-01",
    dueDate: "2026-08-31",
    currency: "USD",
    subtotal: 408.0,
    tax: 40.8,
    total: 448.8,
    status: "matched",
    confidence: 95,
    source: "manual_upload",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-005", 480, 0.85),
    ],
  },
  {
    id: "INV-2026-032",
    vendor: "Pacific Commodities",
    vendorCode: "PC",
    reconcile: true,
    date: "2026-08-01",
    dueDate: "2026-08-31",
    currency: "USD",
    subtotal: 1640.0,
    tax: 164.0,
    total: 1804.0,
    status: "mismatch",
    mismatchField: "qty",
    confidence: 72,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-007", 4, 410.0),
    ],
  },

  // ============================================================
  // 2026-07-31 (3 invoices)
  // ============================================================
  {
    id: "INV-2026-031",
    vendor: "Quartet Packaging",
    vendorCode: "QR",
    reconcile: false,
    date: "2026-07-31",
    dueDate: "2026-08-30",
    currency: "USD",
    subtotal: 145.0,
    tax: 14.5,
    total: 159.5,
    status: "matched",
    confidence: 94,
    source: "inventory_webhook",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-005", 80, 0.85),
      line("SKU-009", 20, 4.1),
    ],
  },
  {
    id: "INV-2026-030",
    vendor: "Riverside Grains",
    vendorCode: "RG",
    reconcile: true,
    date: "2026-07-31",
    dueDate: "2026-08-30",
    currency: "USD",
    subtotal: 880.0,
    tax: 88.0,
    total: 968.0,
    status: "matched",
    confidence: 96,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-003", 200, 2.4),
      line("SKU-010", 40, 8.0),
      line("SKU-011", 30, 11.5),
    ],
  },
  {
    id: "INV-2026-029",
    vendor: "Tideline Seafood",
    vendorCode: "TS",
    reconcile: false,
    date: "2026-07-31",
    dueDate: "2026-08-30",
    currency: "USD",
    subtotal: 320.0,
    tax: 32.0,
    total: 352.0,
    status: "pending",
    confidence: 79,
    source: "whatsapp",
    paymentType: "cash_central",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-002", 10, 32.0),
    ],
  },

  // ============================================================
  // 2026-07-30 (4 invoices)
  // ============================================================
  {
    id: "INV-2026-028",
    vendor: "Upland Farms",
    vendorCode: "UP",
    reconcile: true,
    date: "2026-07-30",
    dueDate: "2026-08-29",
    currency: "USD",
    subtotal: 650.0,
    tax: 65.0,
    total: 715.0,
    status: "matched",
    confidence: 97,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 30, 14.5),
      line("SKU-010", 25, 8.0),
    ],
  },
  {
    id: "INV-2026-027",
    vendor: "Verdant Botanicals",
    vendorCode: "VB",
    reconcile: false,
    date: "2026-07-30",
    dueDate: "2026-08-29",
    currency: "USD",
    subtotal: 480.0,
    tax: 48.0,
    total: 528.0,
    status: "matched",
    confidence: 92,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 120, 3.8),
      line("SKU-012", 5, 12.8),
    ],
  },
  {
    id: "INV-2026-026",
    vendor: "Whitman Refinery",
    vendorCode: "WR",
    reconcile: true,
    date: "2026-07-30",
    dueDate: "2026-08-29",
    currency: "USD",
    subtotal: 4200.0,
    tax: 420.0,
    total: 4620.0,
    status: "mismatch",
    mismatchField: "price",
    confidence: 67,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-006", 1, 2400.0),
      line("SKU-007", 3, 466.67),
    ],
  },
  {
    id: "INV-2026-025",
    vendor: "Yokoyama Supplies",
    vendorCode: "YS",
    reconcile: false,
    date: "2026-07-30",
    dueDate: "2026-08-29",
    currency: "USD",
    subtotal: 252.0,
    tax: 25.2,
    total: 277.2,
    status: "matched",
    confidence: 95,
    source: "whatsapp",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-008", 200, 0.55),
      line("SKU-005", 150, 0.85),
    ],
  },

  // ============================================================
  // 2026-07-29 (4 invoices)
  // ============================================================
  {
    id: "INV-2026-024",
    vendor: "Acme Coffee Roasters",
    vendorCode: "AC",
    reconcile: true,
    date: "2026-07-29",
    dueDate: "2026-08-28",
    currency: "USD",
    subtotal: 1450.0,
    tax: 145.0,
    total: 1595.0,
    status: "matched",
    confidence: 96,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 100, 14.5),
    ],
  },
  {
    id: "INV-2026-023",
    vendor: "Blue Bottle Beans",
    vendorCode: "BB",
    reconcile: true,
    date: "2026-07-29",
    dueDate: "2026-08-28",
    currency: "USD",
    subtotal: 720.0,
    tax: 72.0,
    total: 792.0,
    status: "matched",
    confidence: 95,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 40, 18.0),
    ],
  },
  {
    id: "INV-2026-022",
    vendor: "Crimson Bakery",
    vendorCode: "CB",
    reconcile: false,
    date: "2026-07-29",
    dueDate: "2026-08-28",
    currency: "USD",
    subtotal: 312.0,
    tax: 31.2,
    total: 343.2,
    status: "matched",
    confidence: 93,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-003", 60, 2.4),
      line("SKU-010", 24, 8.0),
    ],
  },
  {
    id: "INV-2026-021",
    vendor: "Delta Syrups",
    vendorCode: "DS",
    reconcile: true,
    date: "2026-07-29",
    dueDate: "2026-08-28",
    currency: "USD",
    subtotal: 162.0,
    tax: 16.2,
    total: 178.2,
    status: "mismatch",
    mismatchField: "qty",
    confidence: 69,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-012", 12, 13.5),
    ],
  },

  // ============================================================
  // 2026-07-28 (4 invoices)
  // ============================================================
  {
    id: "INV-2026-020",
    vendor: "Eden Mills",
    vendorCode: "EM",
    reconcile: false,
    date: "2026-07-28",
    dueDate: "2026-08-27",
    currency: "USD",
    subtotal: 188.0,
    tax: 18.8,
    total: 206.8,
    status: "matched",
    confidence: 94,
    source: "manual_upload",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 40, 3.6),
      line("SKU-012", 4, 13.0),
    ],
  },
  {
    id: "INV-2026-019",
    vendor: "Fairfield Agriculture",
    vendorCode: "FA",
    reconcile: true,
    date: "2026-07-28",
    dueDate: "2026-08-27",
    currency: "USD",
    subtotal: 6000.0,
    tax: 600.0,
    total: 6600.0,
    status: "matched",
    confidence: 99,
    source: "inventory_webhook",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-006", 2, 2400.0),
      line("SKU-007", 4, 300.0),
    ],
  },
  {
    id: "INV-2026-018",
    vendor: "Goldleaf Beverages",
    vendorCode: "GB",
    reconcile: true,
    date: "2026-07-28",
    dueDate: "2026-08-27",
    currency: "USD",
    subtotal: 96.0,
    tax: 9.6,
    total: 105.6,
    status: "matched",
    confidence: 93,
    source: "whatsapp",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 12, 3.5),
      line("SKU-008", 100, 0.55),
    ],
  },
  {
    id: "INV-2026-017",
    vendor: "Harbor Coffee Co.",
    vendorCode: "HC",
    reconcile: true,
    date: "2026-07-28",
    dueDate: "2026-08-27",
    currency: "USD",
    subtotal: 2160.0,
    tax: 216.0,
    total: 2376.0,
    status: "matched",
    confidence: 97,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 150, 14.4),
    ],
  },

  // ============================================================
  // 2026-07-27 (3 invoices)
  // ============================================================
  {
    id: "INV-2026-016",
    vendor: "Indigo Mfg.",
    vendorCode: "IM",
    reconcile: false,
    date: "2026-07-27",
    dueDate: "2026-08-26",
    currency: "USD",
    subtotal: 408.0,
    tax: 40.8,
    total: 448.8,
    status: "matched",
    confidence: 94,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-004", 20, 6.25),
      line("SKU-009", 60, 4.1),
    ],
  },
  {
    id: "INV-2026-015",
    vendor: "Jade Leaf Tea",
    vendorCode: "JL",
    reconcile: false,
    date: "2026-07-27",
    dueDate: "2026-08-26",
    currency: "USD",
    subtotal: 295.0,
    tax: 29.5,
    total: 324.5,
    status: "pending",
    confidence: 82,
    source: "manual_upload",
    paymentType: "cash_central",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-001", 12, 14.0),
      line("SKU-012", 9, 12.5),
    ],
  },
  {
    id: "INV-2026-014",
    vendor: "Kingfisher Produce",
    vendorCode: "KP",
    reconcile: false,
    date: "2026-07-27",
    dueDate: "2026-08-26",
    currency: "USD",
    subtotal: 344.0,
    tax: 34.4,
    total: 378.4,
    status: "matched",
    confidence: 91,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-010", 18, 8.0),
      line("SKU-011", 12, 11.5),
      line("SKU-003", 20, 2.5),
    ],
  },

  // ============================================================
  // 2026-07-25 (3 invoices)
  // ============================================================
  {
    id: "INV-2026-013",
    vendor: "Lakeside Dairy",
    vendorCode: "LM",
    reconcile: true,
    date: "2026-07-25",
    dueDate: "2026-08-24",
    currency: "USD",
    subtotal: 760.0,
    tax: 76.0,
    total: 836.0,
    status: "matched",
    confidence: 96,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 200, 3.8),
    ],
  },
  {
    id: "INV-2026-012",
    vendor: "Meridian Roasters",
    vendorCode: "MR",
    reconcile: true,
    date: "2026-07-25",
    dueDate: "2026-08-24",
    currency: "USD",
    subtotal: 1450.0,
    tax: 145.0,
    total: 1595.0,
    status: "matched",
    confidence: 97,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 100, 14.5),
    ],
  },
  {
    id: "INV-2026-011",
    vendor: "Northstar Spices",
    vendorCode: "NS",
    reconcile: false,
    date: "2026-07-25",
    dueDate: "2026-08-24",
    currency: "USD",
    subtotal: 188.0,
    tax: 18.8,
    total: 206.8,
    status: "mismatch",
    mismatchField: "price",
    confidence: 63,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "needs_review",
    customTag: "review",
    lines: [
      line("SKU-003", 20, 2.4),
      line("SKU-011", 12, 11.5),
    ],
  },

  // ============================================================
  // 2026-07-23 (3 invoices)
  // ============================================================
  {
    id: "INV-2026-010",
    vendor: "Orbit Cups",
    vendorCode: "OC",
    reconcile: false,
    date: "2026-07-23",
    dueDate: "2026-08-22",
    currency: "USD",
    subtotal: 850.0,
    tax: 85.0,
    total: 935.0,
    status: "matched",
    confidence: 95,
    source: "manual_upload",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-005", 1000, 0.85),
    ],
  },
  {
    id: "INV-2026-009",
    vendor: "Pacific Commodities",
    vendorCode: "PC",
    reconcile: true,
    date: "2026-07-23",
    dueDate: "2026-08-22",
    currency: "USD",
    subtotal: 1640.0,
    tax: 164.0,
    total: 1804.0,
    status: "matched",
    confidence: 96,
    source: "whatsapp",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-007", 4, 410.0),
    ],
  },
  {
    id: "INV-2026-008",
    vendor: "Quartet Packaging",
    vendorCode: "QR",
    reconcile: false,
    date: "2026-07-23",
    dueDate: "2026-08-22",
    currency: "USD",
    subtotal: 110.0,
    tax: 11.0,
    total: 121.0,
    status: "matched",
    confidence: 92,
    source: "inventory_webhook",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-005", 80, 0.85),
      line("SKU-009", 12, 4.1),
    ],
  },

  // ============================================================
  // 2026-07-21 (3 invoices)
  // ============================================================
  {
    id: "INV-2026-007",
    vendor: "Riverside Grains",
    vendorCode: "RG",
    reconcile: true,
    date: "2026-07-21",
    dueDate: "2026-08-20",
    currency: "USD",
    subtotal: 580.0,
    tax: 58.0,
    total: 638.0,
    status: "matched",
    confidence: 97,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-003", 100, 2.4),
      line("SKU-010", 40, 8.0),
    ],
  },
  {
    id: "INV-2026-006",
    vendor: "Tideline Seafood",
    vendorCode: "TS",
    reconcile: false,
    date: "2026-07-21",
    dueDate: "2026-08-20",
    currency: "USD",
    subtotal: 320.0,
    tax: 32.0,
    total: 352.0,
    status: "matched",
    confidence: 90,
    source: "whatsapp",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 10, 32.0),
    ],
  },
  {
    id: "INV-2026-005",
    vendor: "Upland Farms",
    vendorCode: "UP",
    reconcile: true,
    date: "2026-07-21",
    dueDate: "2026-08-20",
    currency: "USD",
    subtotal: 425.0,
    tax: 42.5,
    total: 467.5,
    status: "matched",
    confidence: 96,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 25, 14.5),
      line("SKU-010", 6, 7.5),
    ],
  },

  // ============================================================
  // Earlier week (3 invoices)
  // ============================================================
  {
    id: "INV-2026-004",
    vendor: "Verdant Botanicals",
    vendorCode: "VB",
    reconcile: false,
    date: "2026-07-19",
    dueDate: "2026-08-18",
    currency: "USD",
    subtotal: 480.0,
    tax: 48.0,
    total: 528.0,
    status: "matched",
    confidence: 92,
    source: "inventory_webhook",
    paymentType: "cash_outlet",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-002", 120, 3.8),
      line("SKU-012", 5, 12.8),
    ],
  },
  {
    id: "INV-2026-003",
    vendor: "Whitman Refinery",
    vendorCode: "WR",
    reconcile: true,
    date: "2026-07-17",
    dueDate: "2026-08-16",
    currency: "USD",
    subtotal: 2400.0,
    tax: 240.0,
    total: 2640.0,
    status: "matched",
    confidence: 98,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-006", 1, 2400.0),
    ],
  },
  {
    id: "INV-2026-002",
    vendor: "Yokoyama Supplies",
    vendorCode: "YS",
    reconcile: false,
    date: "2026-07-15",
    dueDate: "2026-08-14",
    currency: "USD",
    subtotal: 252.0,
    tax: 25.2,
    total: 277.2,
    status: "matched",
    confidence: 95,
    source: "whatsapp",
    paymentType: "cash_central",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-008", 200, 0.55),
      line("SKU-005", 150, 0.85),
    ],
  },
  {
    id: "INV-2026-001",
    vendor: "Acme Coffee Roasters",
    vendorCode: "AC",
    reconcile: true,
    date: "2026-07-12",
    dueDate: "2026-08-11",
    currency: "USD",
    subtotal: 1450.0,
    tax: 145.0,
    total: 1595.0,
    status: "matched",
    confidence: 98,
    source: "manual_upload",
    paymentType: "transfer",
    reconcileStatus: "confirmed",
    customTag: "matching",
    lines: [
      line("SKU-001", 100, 14.5),
    ],
  },
];

// Mirror `id` into `invoiceNumber` for every invoice (production uses both labels).
for (const inv of INVOICES) {
  if (!inv.invoiceNumber) inv.invoiceNumber = inv.id;
}

// ---------------------------------------------------------------------------
// Receiving log — 60 entries spanning all 5 outlets + 12 SKUs
// ---------------------------------------------------------------------------

export const STOCK_ENTRIES: StockEntry[] = [
  // Today
  { sku: "SKU-001", outlet: "WH", loggedQty: 80, invoicedQty: 80 },
  { sku: "SKU-002", outlet: "O1", loggedQty: 50, invoicedQty: 50 },
  { sku: "SKU-005", outlet: "O1", loggedQty: 60, invoicedQty: 60 },
  { sku: "SKU-001", outlet: "O2", loggedQty: 40, invoicedQty: 40 },
  { sku: "SKU-003", outlet: "O3", loggedQty: 60, invoicedQty: 60 },
  { sku: "SKU-002", outlet: "O4", loggedQty: 40, invoicedQty: 40 },
  { sku: "SKU-012", outlet: "O4", loggedQty: 20, invoicedQty: 20 },
  { sku: "SKU-003", outlet: "O5", loggedQty: 30, invoicedQty: 30 },
  { sku: "SKU-010", outlet: "O5", loggedQty: 12, invoicedQty: 12 },

  // Yesterday
  { sku: "SKU-012", outlet: "WH", loggedQty: 30, invoicedQty: 36 },
  { sku: "SKU-002", outlet: "O1", loggedQty: 80, invoicedQty: 80 },
  { sku: "SKU-010", outlet: "O2", loggedQty: 18, invoicedQty: 18 },
  { sku: "SKU-011", outlet: "O2", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-003", outlet: "O2", loggedQty: 16, invoicedQty: 16 },
  { sku: "SKU-006", outlet: "WH", loggedQty: 2, invoicedQty: 2 },
  { sku: "SKU-007", outlet: "O3", loggedQty: 3, invoicedQty: 4 },
  { sku: "SKU-002", outlet: "O4", loggedQty: 18, invoicedQty: 18 },
  { sku: "SKU-008", outlet: "O5", loggedQty: 60, invoicedQty: 60 },
  { sku: "SKU-001", outlet: "O2", loggedQty: 15, invoicedQty: 15 },
  { sku: "SKU-012", outlet: "O3", loggedQty: 8, invoicedQty: 8 },

  // 2026-08-02
  { sku: "SKU-001", outlet: "WH", loggedQty: 200, invoicedQty: 200 },
  { sku: "SKU-008", outlet: "WH", loggedQty: 1000, invoicedQty: 1000 },
  { sku: "SKU-005", outlet: "O1", loggedQty: 480, invoicedQty: 480 },
  { sku: "SKU-004", outlet: "O2", loggedQty: 20, invoicedQty: 20 },
  { sku: "SKU-009", outlet: "O4", loggedQty: 50, invoicedQty: 50 },
  { sku: "SKU-010", outlet: "O3", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-011", outlet: "O3", loggedQty: 8, invoicedQty: 8 },
  { sku: "SKU-003", outlet: "O5", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-002", outlet: "WH", loggedQty: 300, invoicedQty: 300 },

  // 2026-08-01
  { sku: "SKU-001", outlet: "WH", loggedQty: 200, invoicedQty: 200 },
  { sku: "SKU-003", outlet: "O1", loggedQty: 25, invoicedQty: 25 },
  { sku: "SKU-011", outlet: "O2", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-005", outlet: "O3", loggedQty: 480, invoicedQty: 480 },
  { sku: "SKU-007", outlet: "O2", loggedQty: 4, invoicedQty: 4 },

  // 2026-07-31
  { sku: "SKU-005", outlet: "O4", loggedQty: 80, invoicedQty: 80 },
  { sku: "SKU-009", outlet: "O2", loggedQty: 20, invoicedQty: 20 },
  { sku: "SKU-003", outlet: "WH", loggedQty: 200, invoicedQty: 200 },
  { sku: "SKU-010", outlet: "O3", loggedQty: 40, invoicedQty: 40 },
  { sku: "SKU-011", outlet: "O3", loggedQty: 30, invoicedQty: 30 },
  { sku: "SKU-002", outlet: "O5", loggedQty: 10, invoicedQty: 10 },

  // 2026-07-30
  { sku: "SKU-001", outlet: "O3", loggedQty: 30, invoicedQty: 30 },
  { sku: "SKU-010", outlet: "O3", loggedQty: 25, invoicedQty: 25 },
  { sku: "SKU-002", outlet: "O4", loggedQty: 120, invoicedQty: 120 },
  { sku: "SKU-012", outlet: "O4", loggedQty: 5, invoicedQty: 5 },
  { sku: "SKU-006", outlet: "WH", loggedQty: 1, invoicedQty: 1 },
  { sku: "SKU-007", outlet: "WH", loggedQty: 3, invoicedQty: 3 },
  { sku: "SKU-008", outlet: "O5", loggedQty: 200, invoicedQty: 200 },
  { sku: "SKU-005", outlet: "O5", loggedQty: 150, invoicedQty: 150 },

  // 2026-07-29
  { sku: "SKU-001", outlet: "WH", loggedQty: 100, invoicedQty: 100 },
  { sku: "SKU-001", outlet: "O2", loggedQty: 40, invoicedQty: 40 },
  { sku: "SKU-003", outlet: "O2", loggedQty: 60, invoicedQty: 60 },
  { sku: "SKU-010", outlet: "O2", loggedQty: 24, invoicedQty: 24 },
  { sku: "SKU-012", outlet: "O1", loggedQty: 11, invoicedQty: 12 },

  // 2026-07-28
  { sku: "SKU-002", outlet: "O4", loggedQty: 40, invoicedQty: 40 },
  { sku: "SKU-012", outlet: "O4", loggedQty: 4, invoicedQty: 4 },
  { sku: "SKU-006", outlet: "WH", loggedQty: 2, invoicedQty: 2 },
  { sku: "SKU-007", outlet: "WH", loggedQty: 4, invoicedQty: 4 },
  { sku: "SKU-002", outlet: "O3", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-008", outlet: "O3", loggedQty: 100, invoicedQty: 100 },
  { sku: "SKU-001", outlet: "WH", loggedQty: 150, invoicedQty: 150 },

  // 2026-07-27
  { sku: "SKU-004", outlet: "O2", loggedQty: 20, invoicedQty: 20 },
  { sku: "SKU-009", outlet: "O3", loggedQty: 60, invoicedQty: 60 },
  { sku: "SKU-001", outlet: "O3", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-012", outlet: "O3", loggedQty: 9, invoicedQty: 9 },
  { sku: "SKU-010", outlet: "O4", loggedQty: 18, invoicedQty: 18 },
  { sku: "SKU-011", outlet: "O4", loggedQty: 12, invoicedQty: 12 },
  { sku: "SKU-003", outlet: "O4", loggedQty: 20, invoicedQty: 20 },
];

// ---------------------------------------------------------------------------
// Supplier mapping — vendor → accounting code, tax id, contact
// ---------------------------------------------------------------------------

export const SUPPLIER_MAPPINGS: SupplierMapping[] = VENDORS.map((v) => {
  const codeSum = v.code.charCodeAt(0) + v.code.charCodeAt(1);
  const taxNumeric = (9000 + (codeSum % 999)).toString().padStart(3, "0").slice(-3);
  return {
    vendorCode: v.code,
    vendorName: v.name,
    accountingCode: `2100-${v.code}`,
    taxId: `TX-${v.code}-${taxNumeric}`,
    contact: `ap@${v.name.toLowerCase().replace(/[^a-z]/g, "")}.example`,
    active: true,
    lastInvoice: INVOICES.find((inv) => inv.vendorCode === v.code)?.id ?? "—",
    paymentTerm: "Net 30",
    currency: "USD",
    reconcile: INVOICES.find((inv) => inv.vendorCode === v.code)?.reconcile ?? false,
  };
});

// ---------------------------------------------------------------------------
// Helpers — totals and counts derived from the fixtures
// ---------------------------------------------------------------------------

export function invoiceTotal(inv: Invoice): number {
  return inv.total;
}

export function fmtCurrency(value: number, _currency = "USD"): string {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function statusLabel(status: InvoiceStatus): string {
  if (status === "matched") return "Scanned";
  if (status === "mismatch") return "Review";
  return "Processing";
}

export function statusTone(status: InvoiceStatus): "ok" | "bad" | "warn" {
  if (status === "matched") return "ok";
  if (status === "mismatch") return "bad";
  return "warn";
}

export function mismatchLabel(field: MismatchField | undefined): string {
  if (!field) return "—";
  if (field === "qty") return "Quantity mismatch";
  if (field === "price") return "Unit price mismatch";
  if (field === "total") return "Subtotal mismatch";
  if (field === "sku") return "Unknown SKU";
  return "—";
}

export function sourceLabel(source: Invoice["source"]): string {
  switch (source) {
    case "manual_upload":
      return "Manual Upload";
    case "whatsapp":
      return "WhatsApp";
    case "inventory_webhook":
      return "Inventory Webhook";
    case "google_drive":
      return "Google Drive";
    case "ecommerce":
      return "E-commerce";
  }
}

export function sourceChannelShort(source: Invoice["source"]): string {
  switch (source) {
    case "manual_upload":
      return "UP";
    case "whatsapp":
      return "WA";
    case "inventory_webhook":
      return "INV";
    case "google_drive":
      return "GD";
    case "ecommerce":
      return "EC";
  }
}

export function paymentTypeLabel(p: Invoice["paymentType"]): string {
  if (p === "cash_central") return "Cash Central";
  if (p === "cash_outlet") return "Cash Outlet";
  return "Transfer";
}

export function paymentTypeShort(p: Invoice["paymentType"]): "PCC" | "PCO" | "TF" {
  if (p === "cash_central") return "PCC";
  if (p === "cash_outlet") return "PCO";
  return "TF";
}

export function tagLabel(tag: Invoice["customTag"]): string {
  switch (tag) {
    case "matching":
      return "Matching";
    case "review":
      return "Review";
    case "delete":
      return "Delete";
    case "payment_request":
      return "Payment Request";
  }
}

export function tagDotClass(tag: Invoice["customTag"]): string {
  switch (tag) {
    case "matching":
      return "bg-emerald-500";
    case "review":
      return "bg-amber-500";
    case "delete":
      return "bg-red-500";
    case "payment_request":
      return "bg-blue-500";
  }
}

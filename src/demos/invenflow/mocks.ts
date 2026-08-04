// src/demos/invenflow/mocks.ts
//
// Synthetic fixtures for the Invenflow prototype. All data is rebuilt from
// scratch from descriptions in src/data/portfolio.ts. No real vendor names,
// SKUs, or PO numbers are used. PO numbering follows PO-2026-{NNN} format
// (year-based, zero-padded) — see PURCHASE_ORDERS below.

import {
  OUTLETS,
  SKUS,
  VENDORS,
  type OutletId,
  type Sku,
  type Vendor,
} from "../_shared/fixtures/inventory";

// ---- Vendor display names (hover/expansion only) -----------------------------
//
// All fixtures reference vendors by their short code (V-A, V-B, …). The display
// names below appear only on hover/expansion so the kanban stays scannable
// while still feeling like real-world PO references.

export interface VendorMeta {
  code: string;
  displayName: string;
  category: string;
  leadTimeDays: number;
}

export const VENDOR_META: VendorMeta[] = [
  { code: "VA", displayName: "Atlas Beverage Co.", category: "Beverage supplier", leadTimeDays: 3 },
  { code: "VB", displayName: "Borneo Packaging Ltd.", category: "Packaging supplier", leadTimeDays: 5 },
  { code: "VC", displayName: "Citra Beans Roasters", category: "Coffee roaster", leadTimeDays: 4 },
  { code: "VD", displayName: "Delta Cleaning Supply", category: "Cleaning consumables", leadTimeDays: 2 },
  { code: "VE", displayName: "Equator Equipment Group", category: "Equipment vendor", leadTimeDays: 14 },
  { code: "VF", displayName: "Flores Flavor House", category: "Syrups & flavorings", leadTimeDays: 7 },
  { code: "VG", displayName: "Garut Highland Dairy", category: "Dairy & alternatives", leadTimeDays: 2 },
];

export function vendorMeta(code: string): VendorMeta | undefined {
  return VENDOR_META.find((v) => v.code === code);
}

export function vendorName(code: string): string {
  return vendorMeta(code)?.displayName ?? code;
}

export function skuLabel(code: string): string {
  const s = SKUS.find((x) => x.code === code);
  return s ? `${s.code} · ${s.name}` : code;
}

export function findSku(code: string): Sku | undefined {
  return SKUS.find((s) => s.code === code);
}

export function findOutletName(id: OutletId): string {
  return OUTLETS.find((o) => o.id === id)?.name ?? id;
}

// ---- Purchase Orders (kanban) ----------------------------------------------

export type POStage = "new" | "approve" | "purchase" | "received";

export const PO_STAGES: POStage[] = ["new", "approve", "purchase", "received"];

export const PO_STAGE_LABEL: Record<POStage, string> = {
  new: "New Request",
  approve: "Approved",
  purchase: "Purchased",
  received: "Received",
};

export interface POLine {
  sku: string;
  qty: number;
  unit: string;
  /** Unit price in IDR. */
  unitPrice: number;
}

export interface PO {
  id: string; // PO-2026-NNN
  vendor: string; // vendor code
  outlet: OutletId;
  lines: POLine[];
  /** Total in IDR — computed from lines; preserved for sorting. */
  total: number;
  /** ISO date. */
  createdAt: string;
  stage: POStage;
  requester: string;
  priority: "low" | "normal" | "high" | "urgent";
  /** Free-text notes shown on the detail drawer. */
  notes?: string;
}

const PO_REQUESTERS = [
  "Person 01",
  "Person 02",
  "Person 03",
  "Person 04",
  "Person 05",
  "Person 06",
  "Person 07",
  "Person 08",
];
const PO_PRIORITIES: PO["priority"][] = ["low", "normal", "normal", "normal", "high", "urgent"];

function makeLines(seed: number): POLine[] {
  const count = 1 + (seed % 4);
  const lines: POLine[] = [];
  for (let i = 0; i < count; i++) {
    const sku = SKUS[(seed + i * 3) % SKUS.length].code;
    const skuDef = SKUS.find((s) => s.code === sku)!;
    const qty = 4 + ((seed * 7 + i * 13) % 28);
    const unitPrice = skuDef.tag === "asset" ? 4_500_000 + ((seed * 11) % 1_500_000) : 18_000 + ((seed * 13 + i * 31) % 95_000);
    lines.push({ sku, qty, unit: skuDef.unit, unitPrice });
  }
  return lines;
}

function totalOf(lines: POLine[]): number {
  return lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
}

const PO_BLUEPRINT: Array<{ vendor: string; outlet: OutletId; stage: POStage; day: number; priority?: PO["priority"] }> = [
  // New Request (drafts) — last 3 days
  { vendor: "VA", outlet: "WH", stage: "new", day: 0 },
  { vendor: "VB", outlet: "O1", stage: "new", day: 0 },
  { vendor: "VC", outlet: "WH", stage: "new", day: 1, priority: "high" },
  { vendor: "VF", outlet: "O2", stage: "new", day: 1 },
  { vendor: "VG", outlet: "O3", stage: "new", day: 2 },
  { vendor: "VD", outlet: "O4", stage: "new", day: 2 },
  { vendor: "VA", outlet: "O5", stage: "new", day: 2, priority: "urgent" },
  { vendor: "VB", outlet: "WH", stage: "new", day: 3 },
  { vendor: "VC", outlet: "O2", stage: "new", day: 3 },
  { vendor: "VF", outlet: "O1", stage: "new", day: 4 },
  { vendor: "VG", outlet: "WH", stage: "new", day: 5 },
  { vendor: "VA", outlet: "O3", stage: "new", day: 5 },
  { vendor: "VE", outlet: "O4", stage: "new", day: 6 },
  { vendor: "VC", outlet: "O5", stage: "new", day: 7 },
  // Approved (about to buy)
  { vendor: "VA", outlet: "WH", stage: "approve", day: 8 },
  { vendor: "VB", outlet: "O1", stage: "approve", day: 9 },
  { vendor: "VG", outlet: "O2", stage: "approve", day: 9, priority: "high" },
  { vendor: "VC", outlet: "O3", stage: "approve", day: 10 },
  { vendor: "VD", outlet: "WH", stage: "approve", day: 11 },
  { vendor: "VF", outlet: "O4", stage: "approve", day: 12 },
  { vendor: "VA", outlet: "O5", stage: "approve", day: 13, priority: "urgent" },
  { vendor: "VE", outlet: "WH", stage: "approve", day: 14 },
  { vendor: "VG", outlet: "O1", stage: "approve", day: 15 },
  { vendor: "VB", outlet: "O3", stage: "approve", day: 16 },
  { vendor: "VC", outlet: "WH", stage: "approve", day: 17 },
  // Purchased / in transit
  { vendor: "VA", outlet: "WH", stage: "purchase", day: 18 },
  { vendor: "VB", outlet: "O1", stage: "purchase", day: 19 },
  { vendor: "VC", outlet: "O2", stage: "purchase", day: 20 },
  { vendor: "VD", outlet: "O3", stage: "purchase", day: 21, priority: "high" },
  { vendor: "VE", outlet: "WH", stage: "purchase", day: 22 },
  { vendor: "VF", outlet: "O4", stage: "purchase", day: 23 },
  { vendor: "VG", outlet: "O5", stage: "purchase", day: 24 },
  { vendor: "VA", outlet: "O1", stage: "purchase", day: 25 },
  { vendor: "VB", outlet: "WH", stage: "purchase", day: 26 },
  { vendor: "VC", outlet: "O3", stage: "purchase", day: 27 },
  { vendor: "VG", outlet: "O2", stage: "purchase", day: 28, priority: "urgent" },
  // Received (closed out)
  { vendor: "VA", outlet: "WH", stage: "received", day: 35 },
  { vendor: "VB", outlet: "O1", stage: "received", day: 36 },
  { vendor: "VC", outlet: "O2", stage: "received", day: 37 },
  { vendor: "VD", outlet: "WH", stage: "received", day: 38 },
  { vendor: "VE", outlet: "WH", stage: "received", day: 40 },
  { vendor: "VF", outlet: "O3", stage: "received", day: 42 },
  { vendor: "VG", outlet: "O4", stage: "received", day: 44 },
  { vendor: "VA", outlet: "O5", stage: "received", day: 45 },
  { vendor: "VB", outlet: "WH", stage: "received", day: 47 },
  { vendor: "VC", outlet: "O1", stage: "received", day: 49 },
  { vendor: "VG", outlet: "O3", stage: "received", day: 50 },
  { vendor: "VD", outlet: "O2", stage: "received", day: 52 },
  { vendor: "VE", outlet: "O4", stage: "received", day: 55 },
  { vendor: "VA", outlet: "WH", stage: "received", day: 56 },
  { vendor: "VF", outlet: "O5", stage: "received", day: 58 },
];

function isoFromDay(day: number): string {
  // "today" is 2026-08-03 (project context); POs span back from there.
  const base = new Date("2026-08-03T00:00:00Z");
  base.setUTCDate(base.getUTCDate() - day);
  return base.toISOString().slice(0, 10);
}

function pad(n: number): string {
  return n.toString().padStart(3, "0");
}

export const PURCHASE_ORDERS: PO[] = PO_BLUEPRINT.map((b, idx) => {
  const seed = idx + 1;
  const lines = makeLines(seed);
  return {
    id: `PO-2026-${pad(seed + 100)}`,
    vendor: b.vendor,
    outlet: b.outlet,
    lines,
    total: totalOf(lines),
    createdAt: isoFromDay(b.day),
    stage: b.stage,
    requester: PO_REQUESTERS[seed % PO_REQUESTERS.length],
    priority: b.priority ?? PO_PRIORITIES[seed % PO_PRIORITIES.length],
  };
});

// ---- Receiving (incoming stock, awaiting confirmation) ---------------------

export interface ReceivingRow {
  poId: string;
  vendor: string;
  outlet: OutletId;
  eta: string;
  itemCount: number;
  /** IDR value of the expected delivery. */
  value: number;
  status: "in_transit" | "arrived" | "received";
  /** Tracking code, used for the "Receive now" sheet. */
  trackingCode: string;
  /** Free-text carrier; "Logistics Partner A" / "Logistics Partner B". */
  carrier: string;
}

export const RECEIVING_ROWS: ReceivingRow[] = [
  // In transit
  { poId: "PO-2026-125", vendor: "VA", outlet: "O1", eta: "2026-08-03", itemCount: 28, value: 1_840_000, status: "in_transit", trackingCode: "TRK-ID-44102", carrier: "Logistics Partner A" },
  { poId: "PO-2026-126", vendor: "VB", outlet: "O2", eta: "2026-08-04", itemCount: 12, value: 540_000, status: "in_transit", trackingCode: "TRK-ID-44108", carrier: "Logistics Partner B" },
  { poId: "PO-2026-128", vendor: "VC", outlet: "WH", eta: "2026-08-05", itemCount: 64, value: 3_120_000, status: "in_transit", trackingCode: "TRK-ID-44121", carrier: "Logistics Partner A" },
  { poId: "PO-2026-129", vendor: "VG", outlet: "O2", eta: "2026-08-03", itemCount: 18, value: 720_000, status: "in_transit", trackingCode: "TRK-ID-44132", carrier: "Logistics Partner C" },
  { poId: "PO-2026-130", vendor: "VA", outlet: "O5", eta: "2026-08-06", itemCount: 36, value: 2_140_000, status: "in_transit", trackingCode: "TRK-ID-44140", carrier: "Logistics Partner B" },
  { poId: "PO-2026-131", vendor: "VF", outlet: "O4", eta: "2026-08-04", itemCount: 22, value: 1_120_000, status: "in_transit", trackingCode: "TRK-ID-44145", carrier: "Logistics Partner A" },
  { poId: "PO-2026-132", vendor: "VE", outlet: "WH", eta: "2026-08-08", itemCount: 2, value: 18_400_000, status: "in_transit", trackingCode: "TRK-ID-44152", carrier: "Logistics Partner B" },
  { poId: "PO-2026-133", vendor: "VB", outlet: "O3", eta: "2026-08-05", itemCount: 14, value: 480_000, status: "in_transit", trackingCode: "TRK-ID-44159", carrier: "Logistics Partner C" },
  { poId: "PO-2026-134", vendor: "VC", outlet: "O1", eta: "2026-08-07", itemCount: 30, value: 1_640_000, status: "in_transit", trackingCode: "TRK-ID-44166", carrier: "Logistics Partner A" },
  { poId: "PO-2026-135", vendor: "VD", outlet: "WH", eta: "2026-08-04", itemCount: 50, value: 980_000, status: "in_transit", trackingCode: "TRK-ID-44173", carrier: "Logistics Partner B" },
  // Arrived (awaiting verify)
  { poId: "PO-2026-120", vendor: "VA", outlet: "O3", eta: "2026-08-02", itemCount: 6, value: 540_000, status: "arrived", trackingCode: "TRK-ID-44092", carrier: "Logistics Partner A" },
  { poId: "PO-2026-122", vendor: "VB", outlet: "O1", eta: "2026-08-03", itemCount: 80, value: 1_840_000, status: "arrived", trackingCode: "TRK-ID-44098", carrier: "Logistics Partner B" },
  { poId: "PO-2026-124", vendor: "VC", outlet: "O5", eta: "2026-08-02", itemCount: 22, value: 1_120_000, status: "arrived", trackingCode: "TRK-ID-44103", carrier: "Logistics Partner C" },
  { poId: "PO-2026-127", vendor: "VF", outlet: "WH", eta: "2026-08-02", itemCount: 42, value: 2_180_000, status: "arrived", trackingCode: "TRK-ID-44112", carrier: "Logistics Partner A" },
  { poId: "PO-2026-130-b", vendor: "VG", outlet: "O2", eta: "2026-08-01", itemCount: 10, value: 320_000, status: "arrived", trackingCode: "TRK-ID-44118", carrier: "Logistics Partner B" },
  { poId: "PO-2026-131-b", vendor: "VA", outlet: "O4", eta: "2026-08-02", itemCount: 12, value: 720_000, status: "arrived", trackingCode: "TRK-ID-44124", carrier: "Logistics Partner C" },
  // Received
  { poId: "PO-2026-118", vendor: "VA", outlet: "WH", eta: "2026-07-29", itemCount: 30, value: 1_640_000, status: "received", trackingCode: "TRK-ID-44055", carrier: "Logistics Partner A" },
  { poId: "PO-2026-119", vendor: "VB", outlet: "O1", eta: "2026-07-30", itemCount: 24, value: 940_000, status: "received", trackingCode: "TRK-ID-44060", carrier: "Logistics Partner B" },
  { poId: "PO-2026-121", vendor: "VC", outlet: "O2", eta: "2026-07-31", itemCount: 64, value: 3_120_000, status: "received", trackingCode: "TRK-ID-44071", carrier: "Logistics Partner C" },
  { poId: "PO-2026-123", vendor: "VE", outlet: "WH", eta: "2026-07-31", itemCount: 2, value: 18_400_000, status: "received", trackingCode: "TRK-ID-44088", carrier: "Logistics Partner B" },
  { poId: "PO-2026-130-c", vendor: "VD", outlet: "O3", eta: "2026-07-30", itemCount: 42, value: 980_000, status: "received", trackingCode: "TRK-ID-44078", carrier: "Logistics Partner A" },
  { poId: "PO-2026-131-c", vendor: "VG", outlet: "O4", eta: "2026-07-30", itemCount: 30, value: 720_000, status: "received", trackingCode: "TRK-ID-44082", carrier: "Logistics Partner C" },
  { poId: "PO-2026-132-b", vendor: "VF", outlet: "O5", eta: "2026-07-31", itemCount: 18, value: 1_120_000, status: "received", trackingCode: "TRK-ID-44090", carrier: "Logistics Partner A" },
  { poId: "PO-2026-133-b", vendor: "VA", outlet: "O3", eta: "2026-07-31", itemCount: 12, value: 540_000, status: "received", trackingCode: "TRK-ID-44095", carrier: "Logistics Partner B" },
  { poId: "PO-2026-134-b", vendor: "VB", outlet: "WH", eta: "2026-07-29", itemCount: 22, value: 980_000, status: "received", trackingCode: "TRK-ID-44062", carrier: "Logistics Partner C" },
  { poId: "PO-2026-135-b", vendor: "VC", outlet: "O1", eta: "2026-07-30", itemCount: 30, value: 1_640_000, status: "received", trackingCode: "TRK-ID-44069", carrier: "Logistics Partner A" },
  { poId: "PO-2026-136", vendor: "VG", outlet: "O2", eta: "2026-07-29", itemCount: 24, value: 720_000, status: "received", trackingCode: "TRK-ID-44048", carrier: "Logistics Partner B" },
  { poId: "PO-2026-137", vendor: "VA", outlet: "O5", eta: "2026-07-28", itemCount: 18, value: 720_000, status: "received", trackingCode: "TRK-ID-44038", carrier: "Logistics Partner C" },
  { poId: "PO-2026-138", vendor: "VF", outlet: "WH", eta: "2026-07-27", itemCount: 50, value: 2_180_000, status: "received", trackingCode: "TRK-ID-44022", carrier: "Logistics Partner A" },
  { poId: "PO-2026-139", vendor: "VC", outlet: "O3", eta: "2026-07-26", itemCount: 64, value: 3_120_000, status: "received", trackingCode: "TRK-ID-44015", carrier: "Logistics Partner B" },
];

// ---- Stocktake --------------------------------------------------------------

export interface StocktakeRow {
  sku: string;
  outlet: OutletId;
  projected: number;
  actual: number | null;
  pinned?: boolean;
  reason?: string;
  /** Optional note from counter. */
  note?: string;
}

/**
 * Build stocktake rows by expanding each SKU across the locations that stock it.
 * Every (sku, outlet) pair gets a deterministic seed so variance reads as
 * plausible: warehouse rows tend to match, outlet rows drift a little.
 */
const STOCKTAKE_SCOPE: Array<{ sku: string; outlets: OutletId[]; baseProj: number }> = [
  { sku: "SKU-001", outlets: ["WH", "O1", "O2", "O3", "O4", "O5"], baseProj: 90 },
  { sku: "SKU-002", outlets: ["WH", "O1", "O3", "O5"], baseProj: 70 },
  { sku: "SKU-003", outlets: ["WH", "O1", "O2"], baseProj: 50 },
  { sku: "SKU-004", outlets: ["WH", "O3"], baseProj: 8 },
  { sku: "SKU-005", outlets: ["WH", "O1", "O2", "O3", "O4", "O5"], baseProj: 220 },
  { sku: "SKU-008", outlets: ["WH", "O2", "O4"], baseProj: 180 },
  { sku: "SKU-009", outlets: ["WH", "O3", "O4"], baseProj: 80 },
  { sku: "SKU-010", outlets: ["WH"], baseProj: 22 },
  { sku: "SKU-011", outlets: ["WH"], baseProj: 18 },
  { sku: "SKU-012", outlets: ["WH", "O1"], baseProj: 14 },
  { sku: "SKU-013", outlets: ["WH", "O2"], baseProj: 12 },
  { sku: "SKU-014", outlets: ["WH", "O3"], baseProj: 10 },
  { sku: "SKU-015", outlets: ["WH", "O1", "O2", "O3", "O4", "O5"], baseProj: 480 },
  { sku: "SKU-016", outlets: ["WH", "O1", "O2", "O3"], baseProj: 320 },
  { sku: "SKU-017", outlets: ["WH", "O1", "O2", "O3", "O4", "O5"], baseProj: 500 },
  { sku: "SKU-018", outlets: ["WH", "O1", "O3"], baseProj: 60 },
  { sku: "SKU-019", outlets: ["WH", "O1", "O2", "O3", "O4", "O5"], baseProj: 460 },
  { sku: "SKU-020", outlets: ["WH", "O1"], baseProj: 30 },
  { sku: "SKU-021", outlets: ["WH", "O2", "O3"], baseProj: 90 },
  { sku: "SKU-022", outlets: ["WH"], baseProj: 12 },
  { sku: "SKU-023", outlets: ["WH", "O1"], baseProj: 24 },
  { sku: "SKU-024", outlets: ["WH"], baseProj: 8 },
  { sku: "SKU-025", outlets: ["WH", "O2", "O4"], baseProj: 60 },
  { sku: "SKU-026", outlets: ["WH", "O3", "O5"], baseProj: 48 },
];

function seedDrift(seed: number, magnitude: number): number {
  // Deterministic pseudo-random drift between -magnitude and +magnitude.
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const r = x - Math.floor(x); // 0..1
  return Math.round((r - 0.5) * 2 * magnitude);
}

export const STOCKTAKE_ROWS: StocktakeRow[] = (() => {
  const rows: StocktakeRow[] = [];
  let seed = 1;
  for (const scope of STOCKTAKE_SCOPE) {
    for (const outlet of scope.outlets) {
      // WH drifts very little; outlets drift more.
      const mag = outlet === "WH" ? 1 : 3;
      const projected = scope.baseProj + seedDrift(seed, Math.max(2, Math.floor(scope.baseProj / 12)));
      // ~85% counted; ~15% blank.
      const counted = (seed * 7) % 100 < 85;
      const drift = seedDrift(seed + 1, mag);
      const actual = counted ? Math.max(0, projected + drift) : null;
      rows.push({ sku: scope.sku, outlet, projected, actual });
      seed++;
    }
  }
  return rows;
})();

// ---- Stock by location (inventory aggregate view) ---------------------------

export interface InventoryRow {
  sku: string;
  outlet: OutletId;
  onHand: number;
  par: number;
  /** Suggested reorder qty to bring on-hand up to par + 1.4 * average usage. */
  reorder: number;
  /** Last 7-day usage in units. */
  weeklyUsage: number;
}

export const INVENTORY_ROWS: InventoryRow[] = (() => {
  const rows: InventoryRow[] = [];
  let seed = 1;
  for (const scope of STOCKTAKE_SCOPE) {
    for (const outlet of scope.outlets) {
      const usage = 4 + (seedDrift(seed, 8));
      const par = scope.baseProj;
      const onHand = Math.max(0, par + seedDrift(seed + 1, Math.max(2, Math.floor(par / 10))));
      const reorder = Math.max(0, par - onHand);
      const weeklyUsage = usage;
      rows.push({ sku: scope.sku, outlet, onHand, par, reorder, weeklyUsage });
      seed++;
    }
  }
  return rows;
})();

// ---- Movement log -----------------------------------------------------------

export type MovementDirection = "in" | "out" | "transfer";

export interface MovementRow {
  id: string;
  date: string; // ISO date
  sku: string;
  fromOutlet: OutletId | null;
  toOutlet: OutletId | null;
  qty: number;
  unit: string;
  direction: MovementDirection;
  reason: string;
  actor: string;
}

export const MOVEMENT_ROWS: MovementRow[] = (() => {
  const rows: MovementRow[] = [];
  const reasons = [
    "Stocktake correction",
    "Restock from WH",
    "Outlet-to-outlet transfer",
    "Customer return",
    "Damaged write-off",
    "Spillage / breakage",
  ];
  const actors = ["Person 02", "Person 05", "Person 07", "Person 03", "Person 01"];
  let seed = 1;
  for (let i = 0; i < 28; i++) {
    const sku = SKUS[(seed * 3) % SKUS.length].code;
    const skuDef = SKUS.find((s) => s.code === sku)!;
    const dir = seedDrift(seed, 3) > 0 ? "transfer" : seedDrift(seed + 1, 2) > 0 ? "in" : "out";
    let from: OutletId | null = null;
    let to: OutletId | null = null;
    if (dir === "in") {
      from = "WH";
      to = ["O1", "O2", "O3", "O4", "O5"][seed % 5] as OutletId;
    } else if (dir === "out") {
      from = ["O1", "O2", "O3", "O4", "O5"][seed % 5] as OutletId;
      to = null;
    } else {
      from = ["O1", "O2", "O3", "O4", "O5"][seed % 5] as OutletId;
      to = ["O1", "O2", "O3", "O4", "O5"][(seed + 2) % 5] as OutletId;
      if (from === to) to = ["O1", "O2", "O3", "O4", "O5"][(seed + 3) % 5] as OutletId;
    }
    const qty = 2 + Math.abs(seedDrift(seed + 2, 14));
    const base = new Date("2026-08-03T00:00:00Z");
    base.setUTCDate(base.getUTCDate() - (seed % 30));
    rows.push({
      id: `MV-2026-${(400 + i).toString()}`,
      date: base.toISOString().slice(0, 10),
      sku,
      fromOutlet: from,
      toOutlet: to,
      qty,
      unit: skuDef.unit,
      direction: dir,
      reason: reasons[seed % reasons.length],
      actor: actors[seed % actors.length],
    });
    seed++;
  }
  return rows;
})();

// ---- Re-exports for screens that want to render Outlet / SKU / Vendor labels

export { OUTLETS, SKUS, VENDORS };
export type { OutletId, Sku, Vendor };
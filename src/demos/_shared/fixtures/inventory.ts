// src/demos/_shared/fixtures/inventory.ts
//
// Synthetic inventory fixtures. Per-app plans extend these with richer data.
// Generic placeholders only. No real vendor names, SKUs, or outlets.

export type OutletId = "WH" | "O1" | "O2" | "O3" | "O4" | "O5";
export interface Outlet { id: OutletId; name: string; code: string; }
export const OUTLETS: Outlet[] = [
  { id: "WH", name: "Central Warehouse", code: "WH" },
  { id: "O1", name: "Outlet 1", code: "O1" },
  { id: "O2", name: "Outlet 2", code: "O2" },
  { id: "O3", name: "Outlet 3", code: "O3" },
  { id: "O4", name: "Outlet 4", code: "O4" },
  { id: "O5", name: "Outlet 5", code: "O5" },
];
export function findOutlet(id: OutletId) { return OUTLETS.find((o) => o.id === id); }

export interface Sku { code: string; name: string; unit: string; tag: "asset" | "cogs" | "consumable" | "stock"; }
export const SKUS: Sku[] = [
  { code: "SKU-001", name: "House Beans 1kg", unit: "kg", tag: "cogs" },
  { code: "SKU-002", name: "Oat Milk 1L",     unit: "L",  tag: "cogs" },
  { code: "SKU-003", name: "Cane Sugar 1kg",  unit: "kg", tag: "cogs" },
  { code: "SKU-004", name: "Branding Stickers (roll)", unit: "roll", tag: "consumable" },
  { code: "SKU-005", name: "Branding Cups 12oz", unit: "pcs", tag: "consumable" },
  { code: "SKU-006", name: "Espresso Machine Pro", unit: "unit", tag: "asset" },
  { code: "SKU-007", name: "Grinder 64mm", unit: "unit", tag: "asset" },
  { code: "SKU-008", name: "Cleaning Tablets", unit: "pcs", tag: "consumable" },
  { code: "SKU-009", name: "Napkin Bulk Pack", unit: "pack", tag: "consumable" },
  { code: "SKU-010", name: "Almond Flour 500g", unit: "kg", tag: "stock" },
  { code: "SKU-011", name: "Cocoa Powder 500g", unit: "kg", tag: "stock" },
  { code: "SKU-012", name: "Vanilla Syrup 750ml", unit: "L", tag: "cogs" },
];

export interface Vendor { code: string; name: string; }
export const VENDORS: Vendor[] = [
  { code: "VA", name: "Vendor A" },
  { code: "VB", name: "Vendor B" },
  { code: "VC", name: "Vendor C" },
  { code: "VD", name: "Vendor D" },
  { code: "VE", name: "Vendor E" },
];
export function findVendor(code: string) { return VENDORS.find((v) => v.code === code); }

export interface StockByLocation {
  sku: string; outlet: OutletId; projected: number; actual: number | null;
}
export const STOCK_BY_LOCATION: StockByLocation[] = [];
// populated by random for demo realism in app plans

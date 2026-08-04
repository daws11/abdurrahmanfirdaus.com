// src/demos/kitchen-fresh/mocks.ts
//
// Synthetic fixtures for the Kitchen Fresh demo. Every name, ID, and string
// is a generic placeholder — no real vendor, customer, staff, or production
// identifier is reproduced here.
//
// Re-exports the OUTLETS list from the shared inventory fixture and adds
// prep-item, stock-check, and shift-handoff fixtures used by the four
// screens. Prep items follow the production app's freshness timer
// semantics: each prep runs a countdown (default 120 min) and derives its
// status from thresholds (alertThreshold=70%, checkThreshold=30%).

import type { OutletId } from "@/demos/_shared/fixtures/inventory";
export { OUTLETS, findOutlet } from "@/demos/_shared/fixtures/inventory";

// ---------- Prep item lifecycle ----------

export type PrepStatus = "pending" | "in-progress" | "done";

/**
 * Freshness lifecycle used by the timer grid. Mirrors the production app's
 * status colors: empty (no timer), good (fresh), alert (yellow), check
 * (red), replace (pulsing red, expired).
 */
export type FreshnessStatus = "empty" | "good" | "alert" | "check" | "replace";

export interface PrepItem {
  id: string;
  /** Display name — generic ingredient or prep task. */
  name: string;
  outletId: OutletId;
  /** The minimum count needed for the day's service. */
  parLevel: number;
  /** How many we currently have prepared. */
  currentCount: number;
  /** Cycle used by the daily-ops row checklist. */
  status: PrepStatus;
  /** Optional prep window in minutes (label "~5 min"). */
  prepMinutes?: number;
  /** Category bucket — added for v3 categorization. */
  category?: PrepCategory;
  /** Demand badge numerator (served / par) — added for v3. */
  demand?: { served: number; par: number };
  /**
   * Minutes since the timer started (0 if empty). Used to derive the
   * freshness status against `expirationMinutes`.
   */
  ageMinutes: number;
  /** Total expiration window in minutes. */
  expirationMinutes: number;
  /** Optional note from staff (e.g. "need to refill by 2pm"). */
  notes?: string;
}

const PREP_ITEM_NAMES: readonly string[] = [
  // Bases
  "Acai Base",
  "Espresso Shot",
  "Granola Mix",
  "Coconut Shavings",
  "Matcha Paste",
  "Banana Puree",
  "Mango Chunks",
  "Strawberry Compote",
  "Blueberry Compote",
  "Protein Scoop",
  "Chia Pudding",
  // Sauces & drizzles
  "Honey Drizzle",
  "Caramel Sauce",
  "Chocolate Sauce",
  "Peanut Butter",
  "Lemon Slices",
  // Garnish
  "Mint Garnish",
  "Cinnamon Dust",
  "Icing Sugar Dust",
  "Toasted Coconut",
  // Ice / temp
  "Ice Block Crushed",
  "Ice Block Cubed",
  // Cleaning
  "Cleaning Solution",
  "Sanitizer Mix",
  // Other
  "Whipped Cream",
  "Yogurt Tub",
  "Almond Milk Carton",
  "Oat Milk Carton",
  "Brown Sugar Pack",
  "White Sugar Pack",
  "Salt Pack",
  "Pepper Pack",
  "Chili Flakes",
  "Soy Sauce Bottle",
  "Chili Sauce Bottle",
  "Sweet Chili Sauce",
  "Tomato Ketchup",
  "Mayonnaise Scoop",
  "Mustard Scoop",
  "BBQ Sauce",
  "Tartar Sauce",
  "Sweet Soy Bottle",
  "Vinegar Bottle",
  "Olive Oil Bottle",
  "Sesame Oil Bottle",
  "Butter Pats",
  "Cream Cheese Portion",
  "Mozzarella Portion",
  "Parmesan Shaved",
];

// Build 5 outlets × 36 prep items = 180 prep rows, deterministically seeded.
const STATUS_CYCLE: PrepStatus[] = ["done", "in-progress", "pending"];

function buildPrepItems(): PrepItem[] {
  const out: PrepItem[] = [];
  const outlets: OutletId[] = ["O1", "O2", "O3", "O4", "O5"];
  let counter = 1;
  for (const outletId of outlets) {
    for (let i = 0; i < PREP_ITEM_NAMES.length; i++) {
      const name = PREP_ITEM_NAMES[i]!;
      const parLevel = 4 + (i % 5); // 4..8
      const status = STATUS_CYCLE[(i + counter) % STATUS_CYCLE.length]!;
      const currentCount =
        status === "done"
          ? parLevel
          : status === "in-progress"
            ? Math.max(0, Math.floor(parLevel / 2))
            : 0;
      const expirationMinutes = 120; // default 2h window per production app
      // Freshness cycle: pending=0 (empty), in-progress=half through, done
      // varies so different outlets show different distributions.
      const ageMinutes =
        status === "pending"
          ? 0
          : status === "in-progress"
            ? Math.round(expirationMinutes * 0.85) // alert zone
            : ((counter * 17) % expirationMinutes);
      const id = `PREP-${String(counter).padStart(3, "0")}`;
      const notes =
        (counter * 13) % 7 === 0
          ? "Refill before 2pm rush"
          : (counter * 19) % 11 === 0
            ? "Switch to new batch after 4pm"
            : undefined;
      out.push({
        id,
        name,
        outletId,
        parLevel,
        currentCount,
        status,
        prepMinutes: 5 + (i % 4) * 5,
        ageMinutes,
        expirationMinutes,
        notes,
      });
      counter++;
    }
  }
  return out;
}

export const PREP_ITEMS: PrepItem[] = buildPrepItems();

/** Cycle the status forward: pending → in-progress → done → pending. */
export function nextPrepStatus(s: PrepStatus): PrepStatus {
  switch (s) {
    case "pending":
      return "in-progress";
    case "in-progress":
      return "done";
    case "done":
      return "pending";
  }
}

/** Map a prep item to its freshness lifecycle status. */
export function getFreshnessStatus(
  p: PrepItem,
  thresholds: { alertThreshold: number; checkThreshold: number } = {
    alertThreshold: 70,
    checkThreshold: 30,
  },
): FreshnessStatus {
  if (p.status === "pending") return "empty";
  if (p.ageMinutes <= 0) return "good";
  if (p.ageMinutes >= p.expirationMinutes) return "replace";
  const pctRemaining = ((p.expirationMinutes - p.ageMinutes) / p.expirationMinutes) * 100;
  if (pctRemaining > thresholds.alertThreshold) return "good";
  if (pctRemaining > thresholds.checkThreshold) return "alert";
  return "check";
}

/** Format ageMinutes as HH:MM:SS remaining (production parity). */
export function formatTimeRemaining(remainingMinutes: number): string {
  const clamped = Math.max(0, remainingMinutes);
  const hours = Math.floor(clamped / 60);
  const mins = Math.floor(clamped % 60);
  const secs = Math.floor((clamped - Math.floor(clamped)) * 60);
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// ---------- Outlet summary (OutletSwitcher cards) ----------

export interface OutletSummary {
  outletId: OutletId;
  total: number;
  done: number;
  inProgress: number;
  pending: number;
  /** Count of prep items in each freshness lifecycle. */
  freshness: Record<FreshnessStatus, number>;
}

export function summarizeOutlet(outletId: OutletId): OutletSummary {
  const rows = PREP_ITEMS.filter((p) => p.outletId === outletId);
  const freshness: Record<FreshnessStatus, number> = {
    empty: 0,
    good: 0,
    alert: 0,
    check: 0,
    replace: 0,
  };
  for (const r of rows) freshness[getFreshnessStatus(r)]++;
  return {
    outletId,
    total: rows.length,
    done: rows.filter((r) => r.status === "done").length,
    inProgress: rows.filter((r) => r.status === "in-progress").length,
    pending: rows.filter((r) => r.status === "pending").length,
    freshness,
  };
}

// ---------- Stock check (per-outlet stocktake checklist) ----------

export type StockState = "ok" | "low" | "out";

export interface StockRow {
  id: string;
  outletId: OutletId;
  item: string;
  /** Quantity we expect to have on hand. */
  expected: number;
  /** Quantity we actually counted. */
  counted: number;
  state: StockState;
  /** Optional category to group rows (supplies / beverage / cleaning). */
  category: "supplies" | "beverage" | "cleaning";
}

const STOCK_ITEM_NAMES: readonly { name: string; category: StockRow["category"] }[] = [
  // Supplies (cups, lids, packaging)
  { name: "Paper Cups 12oz", category: "supplies" },
  { name: "Paper Cups 16oz", category: "supplies" },
  { name: "Lids 12oz", category: "supplies" },
  { name: "Lids 16oz", category: "supplies" },
  { name: "Straws Wrapped", category: "supplies" },
  { name: "Napkins", category: "supplies" },
  { name: "Sugar Packets", category: "supplies" },
  { name: "Salt Packets", category: "supplies" },
  { name: "Plastic Spoons", category: "supplies" },
  { name: "Plastic Forks", category: "supplies" },
  { name: "Takeaway Boxes L", category: "supplies" },
  { name: "Takeaway Boxes M", category: "supplies" },
  { name: "Serviette Pack", category: "supplies" },
  { name: "Food Wrap Roll", category: "supplies" },
  // Beverage (liquid)
  { name: "Bottled Water 500ml", category: "beverage" },
  { name: "Soda Can 330ml", category: "beverage" },
  { name: "Sparkling Water 330ml", category: "beverage" },
  { name: "Iced Tea Bottle", category: "beverage" },
  { name: "Lemonade Bottle", category: "beverage" },
  // Cleaning
  { name: "Cleaning Wipes", category: "cleaning" },
  { name: "Trash Bags", category: "cleaning" },
  { name: "Hand Soap Refill", category: "cleaning" },
  { name: "Sanitizer Refill", category: "cleaning" },
  { name: "Floor Cleaner 1L", category: "cleaning" },
  { name: "Degreaser Spray", category: "cleaning" },
];

function buildStock(): StockRow[] {
  const out: StockRow[] = [];
  const outlets: OutletId[] = ["O1", "O2", "O3", "O4", "O5"];
  let counter = 1;
  for (const outletId of outlets) {
    for (let i = 0; i < STOCK_ITEM_NAMES.length; i++) {
      const def = STOCK_ITEM_NAMES[i]!;
      const expected = 20 + ((i * 7) % 30); // 20..49
      // Deterministic variation so each outlet looks different but stable.
      const variation = ((counter * 13) % 11) - 5; // -5..5
      const counted = Math.max(0, expected + variation);
      const state: StockState =
        counted === 0 ? "out" : counted < expected * 0.5 ? "low" : "ok";
      out.push({
        id: `STK-${String(counter).padStart(3, "0")}`,
        outletId,
        item: def.name,
        expected,
        counted,
        state,
        category: def.category,
      });
      counter++;
    }
  }
  return out;
}

export const STOCK_ROWS: StockRow[] = buildStock();

// ---------- Shift handoff ----------

export interface ShiftNote {
  /** "outgoing" or "incoming". */
  by: "outgoing" | "incoming";
  /** ISO timestamp. */
  at: string;
  /** Free-text body. */
  body: string;
  /** Synthetic staff display name. */
  author: string;
  /** Optional checklist items completed by this shift. */
  checklist: { label: string; done: boolean }[];
}

export interface ShiftHandoff {
  outletId: OutletId;
  /** ISO date of the shift. */
  date: string;
  outgoing: ShiftNote;
  incoming: ShiftNote;
}

// Synthetic but realistic handoff content per outlet. Each outlet has a
// distinct narrative so the screen reads like real staff notes.
const OUTGOING_TEMPLATES: Partial<Record<OutletId, { author: string; body: string; checklist: ShiftNote["checklist"] }>> = {
  O1: {
    author: "Staff 01",
    body:
      "Closing station: espresso group heads cleaned, sanitizer refilled, ice bin topped. Low on 16oz lids — flagged for morning delivery. Mango puree switched at 14:20, see prep sheet.",
    checklist: [
      { label: "Espresso group heads cleaned", done: true },
      { label: "Ice bin refilled", done: true },
      { label: "Trash taken out", done: true },
      { label: "POS closed for shift", done: true },
      { label: "16oz lids restock ordered", done: false },
    ],
  },
  O2: {
    author: "Staff 03",
    body:
      "Smooth afternoon service. Replaced granola mix at 15:00 — old batch was past the alert threshold. Customer at table 7 mentioned the smoothie was a touch icy; pass it on.",
    checklist: [
      { label: "Granola mix replaced", done: true },
      { label: "Fridge temp checked (4°C)", done: true },
      { label: "Tray wash complete", done: true },
      { label: "Restock list emailed", done: true },
      { label: "Smoothie texture feedback noted", done: true },
    ],
  },
  O3: {
    author: "Staff 05",
    body:
      "Heavy lunch rush, ran low on acai base around 13:30. Quick mid-shift prep kept us in stock. Need to bump par level for acai base from 6 → 8. Chai ran out 15 min before close — flag for reorder.",
    checklist: [
      { label: "Mid-shift acai top-up", done: true },
      { label: "Acai par level raised to 8", done: false },
      { label: "Chai reorder submitted", done: true },
      { label: "Floor mopped", done: true },
      { label: "Lights/AC off in back room", done: true },
    ],
  },
  O4: {
    author: "Staff 07",
    body:
      "Quiet day, mostly takeaway. Frother descaled at 14:00. Matcha paste is at the alert threshold — incoming team should switch to new batch if orders pick up.",
    checklist: [
      { label: "Frother descaled", done: true },
      { label: "Matcha paste flagged", done: true },
      { label: "Window display restocked", done: true },
      { label: "Cash drawer counted", done: true },
      { label: "Brewed coffee dumped", done: true },
    ],
  },
  O5: {
    author: "Staff 09",
    body:
      "Two staff called in sick, ran a tight ship with two baristas. Mango compote ran out 16:00 — used strawberry as fallback, customers were fine. Cleaning solution low, restock ordered.",
    checklist: [
      { label: "Covered shifts with 2 baristas", done: true },
      { label: "Mango compote reorder", done: true },
      { label: "Cleaning solution ordered", done: true },
      { label: "POS reconciled", done: true },
      { label: "Floor mats swapped", done: true },
    ],
  },
};

const INCOMING_TEMPLATES: Partial<Record<OutletId, { author: string; body: string; checklist: ShiftNote["checklist"] }>> = {
  O1: {
    author: "Staff 02",
    body:
      "Starting afternoon shift. Will check 16oz lid delivery at 16:30. Plan to do a mid-shift prep top-up at 17:00 before the after-work rush.",
    checklist: [
      { label: "Check 16oz lid delivery", done: false },
      { label: "Mid-shift prep top-up", done: false },
      { label: "Walk fridge temperatures", done: false },
    ],
  },
  O2: {
    author: "Staff 04",
    body:
      "Will keep an eye on the smoothie texture feedback from table 7. Re-check the espresso group head at 17:00, calibrate if needed.",
    checklist: [
      { label: "Smoothie texture spot check", done: false },
      { label: "Espresso calibration", done: false },
      { label: "Update par levels if busy", done: false },
    ],
  },
  O3: {
    author: "Staff 06",
    body:
      "Acknowledged acai par level bump and chai reorder. Will confirm chai ETA in the morning. Expecting a busier-than-usual Saturday tomorrow — pre-batch extra acai.",
    checklist: [
      { label: "Confirm chai reorder ETA", done: false },
      { label: "Pre-batch acai for Saturday", done: false },
      { label: "Review Saturday booking list", done: false },
    ],
  },
  O4: {
    author: "Staff 08",
    body:
      "Quiet shift expected. Will switch to new matcha paste at 16:30 if traffic picks up. Otherwise keep current batch and let it expire naturally.",
    checklist: [
      { label: "Monitor matcha paste usage", done: false },
      { label: "Switch to new matcha batch", done: false },
      { label: "Window display restock", done: false },
    ],
  },
  O5: {
    author: "Staff 10",
    body:
      "Picking up the low-stock flags from outgoing. Will confirm mango compote and cleaning solution ETAs with the warehouse. Back to full staff tomorrow.",
    checklist: [
      { label: "Confirm warehouse ETAs", done: false },
      { label: "Update low-stock sheet", done: false },
      { label: "Brief staff for tomorrow", done: false },
    ],
  },
};

function buildHandoff(): ShiftHandoff[] {
  const outlets: OutletId[] = ["O1", "O2", "O3", "O4", "O5"];
  return outlets.map((outletId) => {
    const o = OUTGOING_TEMPLATES[outletId]!;
    const i = INCOMING_TEMPLATES[outletId]!;
    return {
      outletId,
      date: "2026-08-03",
      outgoing: {
        by: "outgoing",
        at: "2026-08-03T15:55:00",
        body: o.body,
        author: o.author,
        checklist: o.checklist,
      },
      incoming: {
        by: "incoming",
        at: "2026-08-03T16:02:00",
        body: i.body,
        author: i.author,
        checklist: i.checklist,
      },
    };
  });
}

export const SHIFT_HANDOFFS: ShiftHandoff[] = buildHandoff();
// ---------- v3 stubs (categories, dishes, activity logs, label batches, settings) ----------

export type PrepCategory = "base" | "beverage" | "sauce" | "garnish" | "dairy" | "cleaning" | "other";

export const PREP_CATEGORY_META: Record<PrepCategory, { label: string; color: string; dot: string }> = {
  base: { label: "Bases & Purées", color: "#f97316", dot: "#fb923c" },
  beverage: { label: "Beverages", color: "#0ea5e9", dot: "#38bdf8" },
  sauce: { label: "Sauces & Drizzles", color: "#f59e0b", dot: "#fbbf24" },
  garnish: { label: "Garnish & Toppings", color: "#a855f7", dot: "#c084fc" },
  dairy: { label: "Dairy & Alternatives", color: "#22c55e", dot: "#4ade80" },
  cleaning: { label: "Cleaning & Sanitizer", color: "#94a3b8", dot: "#cbd5e1" },
  other: { label: "Other", color: "#64748b", dot: "#94a3b8" },
};

export function getPrepCategoryMeta(cat: string): { label: string; color: string; dot: string } {
  return (PREP_CATEGORY_META as Record<string, { label: string; color: string; dot: string }>)[cat] ?? PREP_CATEGORY_META.other;
}

export interface DishDefinition {
  id: string;
  name: string;
  category: PrepCategory;
  prepMinutes: number;
  shelfLifeMinutes: number;
  outletIds: OutletId[];
  notes?: string;
  posCode?: string;
  defaultDurationMinutes?: number;
  isActive?: boolean;
}

export const DISHES: DishDefinition[] = [
  { id: "DISH-001", name: "Acai Signature Bowl", category: "base", prepMinutes: 8, shelfLifeMinutes: 120, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-002", name: "Matcha Latte", category: "beverage", prepMinutes: 5, shelfLifeMinutes: 90, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-003", name: "Espresso Tonic", category: "beverage", prepMinutes: 4, shelfLifeMinutes: 60, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-004", name: "Caramel Drizzle Parfait", category: "sauce", prepMinutes: 6, shelfLifeMinutes: 180, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-005", name: "Berry Compote Bowl", category: "garnish", prepMinutes: 10, shelfLifeMinutes: 240, outletIds: ["O1", "O2"] },
  { id: "DISH-006", name: "Honey Almond Bowl", category: "dairy", prepMinutes: 7, shelfLifeMinutes: 120, outletIds: ["O3", "O4", "O5"] },
  { id: "DISH-007", name: "Counter Sanitizer Mix", category: "cleaning", prepMinutes: 3, shelfLifeMinutes: 720, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-008", name: "Chia Pudding Cup", category: "base", prepMinutes: 12, shelfLifeMinutes: 360, outletIds: ["O1", "O2", "O3"] },
  { id: "DISH-009", name: "Protein Power Bowl", category: "base", prepMinutes: 8, shelfLifeMinutes: 120, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-010", name: "Lemon Mint Refresher", category: "garnish", prepMinutes: 5, shelfLifeMinutes: 90, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-011", name: "Peanut Butter Cup", category: "sauce", prepMinutes: 4, shelfLifeMinutes: 180, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-012", name: "Coconut Yogurt Parfait", category: "dairy", prepMinutes: 6, shelfLifeMinutes: 240, outletIds: ["O1", "O2", "O3"] },
  { id: "DISH-013", name: "Banana Oat Bowl", category: "base", prepMinutes: 7, shelfLifeMinutes: 120, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
  { id: "DISH-014", name: "Chocolate Drizzle Waffle", category: "sauce", prepMinutes: 9, shelfLifeMinutes: 90, outletIds: ["O1", "O2", "O3"] },
  { id: "DISH-015", name: "Counter Sanitizer Top-up", category: "cleaning", prepMinutes: 2, shelfLifeMinutes: 720, outletIds: ["O1", "O2", "O3", "O4", "O5"] },
];

export interface CategoryDefinition {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  skuCount: number;
  share: number;
  active: boolean;
  /** Optional aliases some screens use. */
  label?: string;
  category?: PrepCategory;
  dishCount?: number;
  stockCount?: number;
  avgPrepMin?: number;
}

export const CATEGORIES: CategoryDefinition[] = [
  { id: "CAT-01", name: "Acai Bowls", parentId: null, color: "#a855f7", skuCount: 14, share: 22, active: true },
  { id: "CAT-02", name: "Coffee", parentId: null, color: "#92400e", skuCount: 18, share: 18, active: true },
  { id: "CAT-03", name: "Matcha & Tea", parentId: null, color: "#22c55e", skuCount: 9, share: 11, active: true },
  { id: "CAT-04", name: "Smoothies", parentId: null, color: "#06b6d4", skuCount: 12, share: 14, active: true },
  { id: "CAT-05", name: "Pastries", parentId: null, color: "#f59e0b", skuCount: 22, share: 16, active: true },
  { id: "CAT-06", name: "Toppings", parentId: null, color: "#ec4899", skuCount: 31, share: 6, active: true },
  { id: "CAT-07", name: "Cleaning Supplies", parentId: null, color: "#94a3b8", skuCount: 8, share: 3, active: true },
  { id: "CAT-08", name: "Packaging", parentId: null, color: "#64748b", skuCount: 12, share: 4, active: true },
  { id: "CAT-09", name: "Beverages (non-coffee)", parentId: null, color: "#0ea5e9", skuCount: 6, share: 4, active: true },
  { id: "CAT-10", name: "Merchandise", parentId: null, color: "#f43f5e", skuCount: 4, share: 2, active: false },
  // Coffee Beans sub-categories
  { id: "CAT-11", name: "Single Origin", parentId: "CAT-02", color: "#b45309", skuCount: 7, share: 8, active: true },
  { id: "CAT-12", name: "Blend", parentId: "CAT-02", color: "#9a3412", skuCount: 6, share: 6, active: true },
  { id: "CAT-13", name: "Decaf", parentId: "CAT-02", color: "#7c2d12", skuCount: 3, share: 2, active: true },
  { id: "CAT-14", name: "Cold Brew Concentrate", parentId: "CAT-02", color: "#451a03", skuCount: 2, share: 2, active: true },
];

export interface ActivityLogEntry {
  id: string;
  at: string;
  outletId: OutletId;
  action: "prep" | "restock" | "waste" | "shift" | "alert" | "menu";
  dish?: string;
  actor: string;
  detail: string;
  tone: "ok" | "warn" | "bad" | "info";
}

export const ACTIVITY_LOGS: ActivityLogEntry[] = [
  { id: "LOG-001", at: "2026-08-03T08:12:00", outletId: "O1", action: "prep", dish: "Acai Base", actor: "Person 02", detail: "Batched 4L, freshness 95%", tone: "ok" },
  { id: "LOG-002", at: "2026-08-03T08:24:00", outletId: "O1", action: "restock", actor: "Person 04", detail: "Branded cups 80pcs received from PO-2026-031", tone: "info" },
  { id: "LOG-003", at: "2026-08-03T09:01:00", outletId: "O2", action: "alert", dish: "Espresso Shot", actor: "System", detail: "Crossed 70% freshness threshold", tone: "warn" },
  { id: "LOG-004", at: "2026-08-03T09:18:00", outletId: "O2", action: "waste", dish: "Brown Sugar Pack", actor: "Person 07", detail: "Marked 1.5kg expired and discarded", tone: "bad" },
  { id: "LOG-005", at: "2026-08-03T10:42:00", outletId: "O3", action: "prep", dish: "Matcha Paste", actor: "Person 11", detail: "Batched 2.5L", tone: "ok" },
  { id: "LOG-006", at: "2026-08-03T11:05:00", outletId: "O3", action: "menu", actor: "Person 02", detail: "Added seasonal Honey Almond Bowl to menu", tone: "info" },
  { id: "LOG-007", at: "2026-08-03T11:33:00", outletId: "O4", action: "alert", dish: "Cleaning Solution", actor: "System", detail: "Par level reached, re-order queued", tone: "warn" },
  { id: "LOG-008", at: "2026-08-03T12:01:00", outletId: "O4", action: "prep", dish: "Berry Compote Bowl", actor: "Person 18", detail: "Batched 3kg, freshness 92%", tone: "ok" },
  { id: "LOG-009", at: "2026-08-03T12:48:00", outletId: "O5", action: "restock", actor: "Person 22", detail: "Branded stickers 12 rolls received from PO-2026-027", tone: "info" },
  { id: "LOG-010", at: "2026-08-03T13:14:00", outletId: "O5", action: "waste", dish: "Banana Puree", actor: "Person 25", detail: "Marked 0.8kg expired", tone: "bad" },
  { id: "LOG-011", at: "2026-08-03T13:55:00", outletId: "WH", action: "shift", actor: "Person 02", detail: "Morning shift closed — closing inventory snapshot saved", tone: "info" },
  { id: "LOG-012", at: "2026-08-03T14:22:00", outletId: "O1", action: "alert", dish: "Granola Mix", actor: "System", detail: "Crossed 30% freshness threshold — replace now", tone: "bad" },
];

export interface LabelBatch {
  id: string;
  at: string;
  outletId: OutletId;
  dish: string;
  qty: number;
  printedBy: string;
  /** Optional aliases — some screens use these names instead. */
  printedAt?: string;
  dishName?: string;
  count?: number;
  expirationMinutes?: number;
  /** Some screens read `outlet` as an alias for `outletId`. */
  outlet?: OutletId;
  /** Some screens reference the POS code of the dish. */
  posCode?: string;
}

export const LABEL_BATCHES: LabelBatch[] = [
  { id: "LBL-001", at: "2026-08-03T08:01:00", outletId: "O1", dish: "Acai Base", qty: 24, printedBy: "Person 02" },
  { id: "LBL-002", at: "2026-08-03T08:35:00", outletId: "O2", dish: "Espresso Shot", qty: 18, printedBy: "Person 05" },
  { id: "LBL-003", at: "2026-08-03T09:12:00", outletId: "O1", dish: "Matcha Paste", qty: 12, printedBy: "Person 02" },
  { id: "LBL-004", at: "2026-08-03T10:25:00", outletId: "O3", dish: "Berry Compote Bowl", qty: 8, printedBy: "Person 14" },
  { id: "LBL-005", at: "2026-08-03T11:48:00", outletId: "O4", dish: "Protein Scoop", qty: 30, printedBy: "Person 18" },
];

export const FRESHNESS_HEX: Record<FreshnessStatus, string> = {
  empty: "#b3b9c1",
  good: "#22c55e",
  alert: "#f59e0b",
  check: "#ef4444",
  replace: "#dc2626",
};

export interface KitchenFreshSettings {
  expirationMinutes: number;
  gridCols: number;
  gridRows: number;
  alertThreshold: number;
  checkThreshold: number;
  demandForecastWindowDays: number;
  demandForecastSameWeekdayOnly: boolean;
  thresholds: { alert: number; check: number };
  integrations: { iSeller: boolean; teaspoon: boolean; whatsapp: boolean; salesExport: boolean };
}

export const DEFAULT_THRESHOLDS = { alert: 70, check: 30 } as const;
export const DEFAULT_SETTINGS: KitchenFreshSettings = {
  expirationMinutes: 120,
  gridCols: 4,
  gridRows: 3,
  alertThreshold: 70,
  checkThreshold: 30,
  demandForecastWindowDays: 30,
  demandForecastSameWeekdayOnly: true,
  thresholds: { alert: 70, check: 30 },
  integrations: { iSeller: true, teaspoon: true, whatsapp: false, salesExport: true },
};

// ---------- v3 type extensions to satisfy screens written before mocks landed ----------

declare module "./mocks" {}

export interface DishDefinitionV3 extends DishDefinition {
  posCode?: string;
  defaultDurationMinutes?: number;
  isActive?: boolean;
}

export interface LabelBatchV3 extends LabelBatch {
  printedAt?: string;
  dishName?: string;
  count?: number;
  expirationMinutes?: number;
}

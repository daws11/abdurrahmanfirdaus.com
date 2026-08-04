// src/demos/invenflow/screens/Categories.tsx
// @ts-nocheck
//
// Category master-data table. Production Category shape (managed):
// id, name, color, description, isActive, isProtected. We add derived columns
// (SKU count, parent name, sub-product share) to keep the table dense.

import { useMemo, useState } from "react";
import { Shapes, Plus, Search, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import {
  CATEGORIES,
  SKUS,
  type Category,
} from "../mocks";

interface CategoryRow extends Category {
  parentName: string | null;
  skuSharePct: number;
  description: string;
  color: string;
}

const DESCRIPTIONS: Record<string, string> = {
  "Coffee Beans": "Green and roasted beans for espresso and filter",
  "Dairy & Alternatives": "Fresh milk, oat, almond — shelf-stable and chilled",
  "Syrups & Sauces": "Flavoring syrups and signature sauces",
  "Tea & Cocoa": "Loose tea, cocoa powder, drinking chocolate",
  Packaging: "Cups, lids, straws, napkins, carriers",
  "Cleaning Supplies": "Tablets, sprays, microfiber, brushes",
  Bakery: "Pastry, bread, sweet baked goods",
  "Fresh Produce": "Fruit, herbs, garnish",
  "Bottled Beverage": "Bottled water, RTD coffee, kombucha",
  Equipment: "Machines, grinders, brewers",
  "Office Supplies": "Stationery, printer, signage",
  "Single-Origin": "Single-origin coffee SKUs (sub of Coffee Beans)",
  Blend: "Blend coffee SKUs (sub of Coffee Beans)",
  Decaf: "Decaffeinated SKUs (sub of Coffee Beans)",
};

const COLORS: Record<string, string> = {
  "Coffee Beans": "#92400e",
  "Dairy & Alternatives": "#3b82f6",
  "Syrups & Sauces": "#a855f7",
  "Tea & Cocoa": "#10b981",
  Packaging: "#6366f1",
  "Cleaning Supplies": "#0ea5e9",
  Bakery: "#f59e0b",
  "Fresh Produce": "#22c55e",
  "Bottled Beverage": "#06b6d4",
  Equipment: "#ef4444",
  "Office Supplies": "#6b7280",
  "Single-Origin": "#7c2d12",
  Blend: "#9a3412",
  Decaf: "#a8a29e",
};

function buildRows(): CategoryRow[] {
  const total = CATEGORIES.reduce((s, c) => s + c.productCount, 0);
  const byId = new Map(CATEGORIES.map((c) => [c.id, c.name]));
  return CATEGORIES.map((c) => ({
    ...c,
    parentName: c.parent ? byId.get(c.parent) ?? null : null,
    skuSharePct: total === 0 ? 0 : Math.round((c.productCount / total) * 100),
    description: DESCRIPTIONS[c.name] ?? "Product category",
    color: COLORS[c.name] ?? "#6b7280",
  }));
}

const CAT_ROWS = buildRows();

function colorSwatch(color: string) {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function skuColorBucket(code: string): string | null {
  // Best-effort category assignment by SKU code (demo synthetic; production
  // joins via the managed product_categories table).
  const first = code.match(/SKU-(\d+)/)?.[1];
  if (!first) return null;
  const idx = Number(first) % 11;
  return CAT_ROWS[idx]?.name ?? null;
}

export default function Categories() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<"all" | "active" | "inactive">("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CAT_ROWS.filter((r) => {
      if (active === "active" && !r.active) return false;
      if (active === "inactive" && r.active) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.parentName ?? "").toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    });
  }, [search, active]);

  const activeCount = CAT_ROWS.filter((r) => r.active).length;
  const inactiveCount = CAT_ROWS.length - activeCount;
  const parentsCount = CAT_ROWS.filter((r) => !r.parent).length;
  const childrenCount = CAT_ROWS.filter((r) => r.parent).length;
  const totalProducts = CAT_ROWS.reduce((s, r) => s + r.productCount, 0);
  const linkedSkuCount = SKUS.filter((s) => skuColorBucket(s.code)).length;

  const columns: Column<CategoryRow>[] = [
    {
      key: "id",
      header: "Code",
      cell: (r) => (
        <span className="font-semibold tabular-nums text-[var(--fg)]">
          {r.id}
        </span>
      ),
      sortBy: (r) => r.id,
    },
    {
      key: "name",
      header: "Category",
      cell: (r) => (
        <div className="flex items-center gap-2">
          {colorSwatch(r.color)}
          <div className="min-w-0">
            <div className="truncate font-medium text-[var(--fg)]">
              {r.name}
            </div>
            <div className="truncate text-[11px] text-[var(--muted)]">
              {r.description}
            </div>
          </div>
        </div>
      ),
      sortBy: (r) => r.name,
    },
    {
      key: "parent",
      header: "Parent",
      cell: (r) =>
        r.parentName ? (
          <span className="text-[var(--fg)]">{r.parentName}</span>
        ) : (
          <span className="text-[var(--muted)]">—</span>
        ),
    },
    {
      key: "productCount",
      header: "SKUs",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.productCount}</span>
      ),
      sortBy: (r) => r.productCount,
    },
    {
      key: "share",
      header: "Share",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.skuSharePct}%</span>
      ),
      sortBy: (r) => r.skuSharePct,
    },
    {
      key: "protected",
      header: "Type",
      cell: (r) =>
        r.parent ? (
          <Badge tone="info">Subcategory</Badge>
        ) : (
          <Badge tone="accent">Top-level</Badge>
        ),
    },
    {
      key: "active",
      header: "Status",
      cell: (r) =>
        r.active ? (
          <Badge tone="ok">Active</Badge>
        ) : (
          <Badge tone="neutral">Inactive</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Manage · Categories
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Product categories
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Managed category hierarchy used by SKU mappings, filters, and the
            stocktake scoped picker. Production flags seed categories as
            <span className="font-medium text-[var(--fg)]"> protected</span> so
            the buyer team can&apos;t rename &quot;Asset&quot; or &quot;Consumable&quot;.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <TagIcon className="h-4 w-4" />
            Bulk re-color
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New category
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Categories"
          value={CAT_ROWS.length.toString()}
          detail={`${parentsCount} top-level · ${childrenCount} sub`}
          tone="accent"
        />
        <StatTile
          label="Active"
          value={activeCount.toString()}
          detail={`${inactiveCount} inactive`}
          tone="ok"
        />
        <StatTile
          label="Linked SKUs"
          value={linkedSkuCount.toString()}
          detail={`of ${SKUS.length} in catalog`}
          tone="info"
        />
        <StatTile
          label="Total products"
          value={totalProducts.toString()}
          detail="Counted across categories"
          tone="neutral"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Field
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, parent, description…"
            className="pl-8"
          />
        </div>
        <div
          className="inline-flex h-9 overflow-hidden rounded-md border text-xs"
          style={{ borderColor: "var(--border)" }}
        >
          {(["all", "active", "inactive"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setActive(k)}
              className="inline-flex h-full items-center px-3 capitalize"
              style={{
                backgroundColor: active === k ? "var(--bg)" : "transparent",
                color: "var(--fg)",
                borderLeft: k === "active" ? "1px solid var(--border)" : undefined,
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.id}
        initialSort={{ key: "productCount", dir: "desc" }}
      />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Shapes className="h-3.5 w-3.5" />
          <span>
            Category color uses the CATEGORY_COLOR_KEYS palette (blue, green,
            purple, amber, slate, red, cyan, indigo, pink, stone, teal,
            orange). The demo uses hex literals; production maps keys to
            Tailwind badge classes.
          </span>
        </div>
      </div>
    </div>
  );
}

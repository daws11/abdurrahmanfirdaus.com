// src/demos/invenflow/screens/Locations.tsx
// @ts-nocheck
//
// Location master-data table. Production Location shape: name, area, code,
// building, floor, capacity, isActive, isWarehouse. We render derived columns
// (SKU count, total stock, fill %) so the table looks operationally honest.

import { useMemo, useState } from "react";
import { Plus, Search, Grid2x2, List, Building2 } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import {
  LOCATIONS,
  INVENTORY_ROWS,
  type LocationMeta,
} from "../mocks";

interface LocationRow extends LocationMeta {
  skuCount: number;
  totalStock: number;
  fillPct: number;
}

function buildRows(): LocationRow[] {
  return LOCATIONS.map((loc) => {
    const inv = INVENTORY_ROWS.filter((r) => r.outlet === loc.id);
    const skuCount = new Set(inv.map((r) => r.sku)).size;
    const totalStock = inv.reduce((s, r) => s + r.onHand, 0);
    const fillPct = Math.min(
      100,
      Math.round((totalStock / Math.max(1, loc.capacity)) * 100),
    );
    return { ...loc, skuCount, totalStock, fillPct };
  });
}

const LOC_ROWS = buildRows();

function typeBadge(t: LocationMeta["type"]) {
  if (t === "warehouse") return <Badge tone="accent">Warehouse</Badge>;
  return <Badge tone="info">Outlet</Badge>;
}

function fillTone(pct: number): "ok" | "warn" | "bad" | "neutral" {
  if (pct >= 85) return "bad";
  if (pct >= 65) return "warn";
  if (pct >= 30) return "ok";
  return "neutral";
}

function activeBadge(active: boolean) {
  return active ? (
    <Badge tone="ok">Active</Badge>
  ) : (
    <Badge tone="neutral">Inactive</Badge>
  );
}

export default function Locations() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [view, setView] = useState<"list" | "grid">("list");

  const areas = useMemo(
    () => ["All", ...Array.from(new Set(LOC_ROWS.map((r) => r.area))).sort()],
    [],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LOC_ROWS.filter((r) => {
      if (area !== "All" && r.area !== area) return false;
      if (type !== "All" && r.type !== type) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.manager.toLowerCase().includes(q)
      );
    });
  }, [search, area, type]);

  const totalCapacity = LOC_ROWS.reduce((s, r) => s + r.capacity, 0);
  const totalStock = LOC_ROWS.reduce((s, r) => s + r.totalStock, 0);
  const warehouseCount = LOC_ROWS.filter((r) => r.type === "warehouse").length;
  const outletCount = LOC_ROWS.filter((r) => r.type === "outlet").length;
  const avgFill = Math.round(
    LOC_ROWS.reduce((s, r) => s + r.fillPct, 0) / Math.max(1, LOC_ROWS.length),
  );

  const columns: Column<LocationRow>[] = [
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
      header: "Location",
      cell: (r) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-[var(--fg)]">
              {r.name}
            </span>
            {typeBadge(r.type)}
          </div>
          <div className="truncate text-[11px] text-[var(--muted)]">
            {r.address}
          </div>
        </div>
      ),
      sortBy: (r) => r.name,
    },
    {
      key: "area",
      header: "Area",
      cell: (r) => (
        <span className="text-[var(--fg)]">{r.area}</span>
      ),
      sortBy: (r) => r.area,
    },
    {
      key: "manager",
      header: "Manager",
      cell: (r) => <span className="text-[var(--fg)]">{r.manager}</span>,
    },
    {
      key: "skuCount",
      header: "SKUs",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.skuCount}</span>
      ),
      sortBy: (r) => r.skuCount,
    },
    {
      key: "totalStock",
      header: "Stock",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.totalStock}</span>
      ),
      sortBy: (r) => r.totalStock,
    },
    {
      key: "capacity",
      header: "Capacity",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">
          {r.capacity.toLocaleString("id-ID")}
        </span>
      ),
      sortBy: (r) => r.capacity,
    },
    {
      key: "fill",
      header: "Fill",
      align: "right",
      cell: (r) => {
        const t = fillTone(r.fillPct);
        return (
          <div className="flex items-center justify-end gap-2">
            <span className="tabular-nums text-[var(--fg)]">{r.fillPct}%</span>
            <Badge tone={t}>
              {t === "bad" ? "Full" : t === "warn" ? "Tight" : t === "ok" ? "OK" : "Light"}
            </Badge>
          </div>
        );
      },
      sortBy: (r) => r.fillPct,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => activeBadge(r.active),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Operations · Locations
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Locations
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Warehouses and outlets grouped by area. Each row shows live SKU
            count, on-hand units, and capacity fill — the same view operations
            uses during weekly stocktake planning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="inline-flex h-9 overflow-hidden rounded-md border text-xs"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              type="button"
              onClick={() => setView("list")}
              className="inline-flex h-full items-center gap-1 px-3"
              style={{
                backgroundColor: view === "list" ? "var(--bg)" : "transparent",
                color: "var(--fg)",
              }}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className="inline-flex h-full items-center gap-1 border-l px-3"
              style={{
                borderColor: "var(--border)",
                backgroundColor: view === "grid" ? "var(--bg)" : "transparent",
                color: "var(--fg)",
              }}
            >
              <Grid2x2 className="h-3.5 w-3.5" />
              Grid
            </button>
          </div>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New location
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Locations"
          value={LOC_ROWS.length.toString()}
          detail={`${warehouseCount} warehouse · ${outletCount} outlet`}
          tone="accent"
        />
        <StatTile
          label="Total capacity"
          value={totalCapacity.toLocaleString("id-ID")}
          detail="Units across all nodes"
          tone="info"
        />
        <StatTile
          label="On-hand"
          value={totalStock.toLocaleString("id-ID")}
          detail={`Avg fill ${avgFill}%`}
          tone="ok"
        />
        <StatTile
          label="Areas"
          value={areas.length - 1 === 0 ? "—" : (areas.length - 1).toString()}
          detail="Regional groupings"
          tone="neutral"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Field
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, address, manager…"
            className="pl-8"
          />
        </div>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-9 rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
          style={{ borderColor: "var(--border)", color: "var(--fg)" }}
        >
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-9 rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
          style={{ borderColor: "var(--border)", color: "var(--fg)" }}
        >
          <option value="All">All types</option>
          <option value="warehouse">Warehouse</option>
          <option value="outlet">Outlet</option>
        </select>
      </div>

      {view === "list" ? (
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
          initialSort={{ key: "fill", dir: "desc" }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <article
              key={r.id}
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-[var(--muted)]" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">
                      {r.id}
                    </span>
                    {typeBadge(r.type)}
                  </div>
                  <div className="mt-1 truncate font-semibold text-[var(--fg)]">
                    {r.name}
                  </div>
                  <div className="truncate text-[11px] text-[var(--muted)]">
                    {r.address}
                  </div>
                </div>
                {activeBadge(r.active)}
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <dt className="uppercase tracking-wider text-[var(--muted)]">
                    Manager
                  </dt>
                  <dd className="text-[var(--fg)]">{r.manager}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wider text-[var(--muted)]">
                    SKUs
                  </dt>
                  <dd className="tabular-nums text-[var(--fg)]">{r.skuCount}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wider text-[var(--muted)]">
                    Fill
                  </dt>
                  <dd className="tabular-nums text-[var(--fg)]">{r.fillPct}%</dd>
                </div>
              </dl>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, r.fillPct)}%`,
                    backgroundColor:
                      r.fillPct >= 85
                        ? "var(--bad)"
                        : r.fillPct >= 65
                          ? "var(--warn)"
                          : "var(--ok)",
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

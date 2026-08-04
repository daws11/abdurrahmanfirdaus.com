// src/demos/invenflow/screens/Inventory.tsx
//
// "Stock by location" aggregate view. Search by SKU, location filter, status
// segmented (All / Below par / Reorder / Over par), sortable columns. Each row
// has a "View movement" action that opens a Sheet with the recent movement
// history for that SKU. Status pills echo the production stocktake vocabulary.

import { useMemo, useState } from "react";
import { AlertTriangle, Boxes, Download, ArrowRightLeft, X, History } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import { Sheet } from "@/demos/_shared/Sheet";
import {
  INVENTORY_ROWS,
  OUTLETS,
  SKUS,
  MOVEMENT_ROWS,
  type OutletId,
  skuLabel,
  findOutletName,
  type InventoryRow,
} from "../mocks";

type Filter = "all" | "low" | "reorder" | "over";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [outlet, setOutlet] = useState<OutletId | "ALL">("ALL");
  const [filter, setFilter] = useState<Filter>("all");
  const [drawerSku, setDrawerSku] = useState<string | null>(null);

  const rows = useMemo(() => {
    return INVENTORY_ROWS.filter((r) => {
      if (outlet !== "ALL" && r.outlet !== outlet) return false;
      if (filter === "low" && r.onHand >= r.par) return false;
      if (filter === "reorder" && r.reorder === 0) return false;
      if (filter === "over" && r.onHand <= r.par) return false;
      if (search) {
        const label = skuLabel(r.sku).toLowerCase();
        if (!label.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, outlet, filter]);

  const totalOnHand = INVENTORY_ROWS.reduce((s, r) => s + r.onHand, 0);
  const reorderRows = INVENTORY_ROWS.filter((r) => r.reorder > 0);
  const lowRows = INVENTORY_ROWS.filter((r) => r.onHand < r.par);
  const overRows = INVENTORY_ROWS.filter((r) => r.onHand > r.par);
  const skuCount = new Set(INVENTORY_ROWS.map((r) => r.sku)).size;

  const drawerMovements = useMemo(() => {
    if (!drawerSku) return [];
    return MOVEMENT_ROWS.filter((m) => m.sku === drawerSku).slice(0, 12);
  }, [drawerSku]);

  function exportCsv() {
    // eslint-disable-next-line no-console
    console.log(`[inventory] export csv ${rows.length} rows`);
  }

  const columns: Column<InventoryRow>[] = [
    {
      key: "sku",
      header: "SKU",
      cell: (r) => (
        <span className="font-medium text-[var(--fg)]">{skuLabel(r.sku)}</span>
      ),
      sortBy: (r) => r.sku,
    },
    {
      key: "outlet",
      header: "Location",
      cell: (r) => findOutletName(r.outlet),
      sortBy: (r) => r.outlet,
    },
    {
      key: "onHand",
      header: "On hand",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums font-medium text-[var(--fg)]">
          {r.onHand}
        </span>
      ),
      sortBy: (r) => r.onHand,
    },
    {
      key: "par",
      header: "Par",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--muted)]">{r.par}</span>
      ),
      sortBy: (r) => r.par,
    },
    {
      key: "usage",
      header: "7-day usage",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--muted)]">{r.weeklyUsage}</span>
      ),
      sortBy: (r) => r.weeklyUsage,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => {
        if (r.onHand < r.par) return <Badge tone="warn">Below par</Badge>;
        if (r.onHand > r.par) return <Badge tone="info">Over par</Badge>;
        return <Badge tone="ok">At par</Badge>;
      },
    },
    {
      key: "reorder",
      header: "Reorder",
      align: "right",
      cell: (r) =>
        r.reorder > 0 ? (
          <span
            className="tabular-nums font-semibold"
            style={{ color: "var(--accent)" }}
          >
            +{r.reorder}
          </span>
        ) : (
          <span className="text-[var(--muted)]">—</span>
        ),
      sortBy: (r) => r.reorder,
    },
    {
      key: "movement",
      header: "",
      align: "right",
      className: "w-px",
      cell: (r) => (
        <button
          type="button"
          onClick={() => setDrawerSku(r.sku)}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--border)] px-2 text-[11px] font-medium text-[var(--fg)] hover:bg-[var(--surface)]"
        >
          <History className="h-3 w-3" />
          Movement
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Workflow · Inventory
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Stock by location
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Aggregate on-hand counts across outlets. Filter by location or
            status to find rows that need a reorder. Open{" "}
            <span className="font-medium text-[var(--fg)]">Movement</span> on a
            row to see its recent transfer log.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <StatTile
          label="SKUs tracked"
          value={skuCount.toString()}
          detail={`${SKUS.length} in catalog`}
          tone="info"
          icon={<Boxes className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="On hand"
          value={totalOnHand.toLocaleString("id-ID")}
          detail="Units across outlets"
          tone="accent"
        />
        <StatTile
          label="Below par"
          value={lowRows.length.toString()}
          detail="Need attention"
          tone={lowRows.length === 0 ? "ok" : "warn"}
          icon={
            lowRows.length > 0 ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : undefined
          }
        />
        <StatTile
          label="Reorder"
          value={reorderRows.length.toString()}
          detail={`${overRows.length} over par`}
          tone="ok"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="min-w-[220px] flex-1">
          <Field
            label="Search SKU"
            placeholder="e.g. SKU-001"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="min-w-[180px]">
          <label className="block">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              Location
            </div>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value as OutletId | "ALL")}
              className="h-9 w-full rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
            >
              <option value="ALL">All locations</option>
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1">
          {(
            [
              { id: "all" as Filter, label: "All" },
              { id: "low" as Filter, label: "Below par" },
              { id: "reorder" as Filter, label: "Reorder" },
              { id: "over" as Filter, label: "Over par" },
            ]
          ).map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className="h-9 rounded-md px-3 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: active ? "var(--accent)" : "var(--bg)",
                  color: active ? "var(--accent-fg)" : "var(--muted)",
                  border: active
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => `${r.sku}-${r.outlet}`}
        initialSort={{ key: "onHand", dir: "asc" }}
        emptyTitle="No rows match"
        emptyDescription="Adjust the filters above to see more inventory."
      />

      <Sheet
        open={!!drawerSku}
        onClose={() => setDrawerSku(null)}
        title={drawerSku ? `${skuLabel(drawerSku)} · Movement` : "Movement"}
        width={460}
      >
        {drawerSku && (
          <div className="space-y-3">
            <div
              className="rounded-md border border-[var(--border)] bg-[var(--bg)] p-3 text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              Recent transfers and write-offs for {skuLabel(drawerSku)}.
              Numbers reflect the in-app movement log.
            </div>
            {drawerMovements.length === 0 && (
              <div className="rounded-md border border-dashed border-[var(--border)] px-3 py-8 text-center text-[11px] text-[var(--muted)]">
                No movement entries recorded yet.
              </div>
            )}
            <ul className="space-y-2">
              {drawerMovements.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start gap-3 rounded-md border border-[var(--border)] p-3 text-sm"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                    style={{
                      backgroundColor:
                        m.direction === "in"
                          ? "rgba(34,197,94,0.12)"
                          : m.direction === "out"
                            ? "rgba(239,68,68,0.12)"
                            : "rgba(17,34,57,0.08)",
                      color:
                        m.direction === "in"
                          ? "var(--ok)"
                          : m.direction === "out"
                            ? "var(--bad)"
                            : "var(--accent)",
                    }}
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-medium text-[var(--fg)]">
                        {m.direction === "in"
                          ? `From ${findOutletName(m.fromOutlet as OutletId)} → ${findOutletName(m.toOutlet as OutletId)}`
                          : m.direction === "out"
                            ? `Out from ${findOutletName(m.fromOutlet as OutletId)}`
                            : `${findOutletName(m.fromOutlet as OutletId)} → ${findOutletName(m.toOutlet as OutletId)}`}
                      </span>
                      <span className="ml-2 shrink-0 text-[11px] tabular-nums text-[var(--muted)]">
                        {m.qty} {m.unit}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                      {m.reason} · {m.actor} · {m.date}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDrawerSku(null)}
              >
                <X className="h-3.5 w-3.5" />
                Close
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
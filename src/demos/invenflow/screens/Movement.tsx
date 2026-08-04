// src/demos/invenflow/screens/Movement.tsx
//
// Stock movement log. Lists recent transfers, write-offs, and adjustments
// across all outlets. Filter by direction (in / out / transfer) and outlet.
// This is the 5th screen (per the spec: one extra beyond the 4 originals).

import { useMemo, useState } from "react";
import { ArrowRightLeft, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import {
  MOVEMENT_ROWS,
  type MovementDirection,
  type MovementRow,
  skuLabel,
  findOutletName,
} from "../mocks";
import type { OutletId } from "../../_shared/fixtures/inventory";

type DirectionFilter = "all" | MovementDirection;

export default function Movement() {
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [outlet, setOutlet] = useState<OutletId | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return MOVEMENT_ROWS.filter((m) => {
      if (direction !== "all" && m.direction !== direction) return false;
      if (outlet !== "ALL" && m.fromOutlet !== outlet && m.toOutlet !== outlet) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !skuLabel(m.sku).toLowerCase().includes(q) &&
          !m.reason.toLowerCase().includes(q) &&
          !m.actor.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [direction, outlet, search]);

  const inQty = MOVEMENT_ROWS.filter((m) => m.direction === "in").reduce((s, m) => s + m.qty, 0);
  const outQty = MOVEMENT_ROWS.filter((m) => m.direction === "out").reduce((s, m) => s + m.qty, 0);
  const transferQty = MOVEMENT_ROWS.filter((m) => m.direction === "transfer").reduce((s, m) => s + m.qty, 0);

  const columns: Column<MovementRow>[] = [
    {
      key: "id",
      header: "Ref",
      cell: (r) => (
        <span className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
          {r.id}
        </span>
      ),
      sortBy: (r) => r.id,
    },
    {
      key: "date",
      header: "Date",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.date}</span>
      ),
      sortBy: (r) => r.date,
    },
    {
      key: "sku",
      header: "SKU",
      cell: (r) => skuLabel(r.sku),
      sortBy: (r) => r.sku,
    },
    {
      key: "direction",
      header: "Direction",
      cell: (r) => {
        if (r.direction === "in") return <Badge tone="ok">Inbound</Badge>;
        if (r.direction === "out") return <Badge tone="bad">Outbound</Badge>;
        return <Badge tone="info">Transfer</Badge>;
      },
      sortBy: (r) => r.direction,
    },
    {
      key: "route",
      header: "Route",
      cell: (r) => {
        if (r.direction === "in") {
          return (
            <span className="text-[var(--fg)]">
              {findOutletName(r.fromOutlet as OutletId)} →{" "}
              {findOutletName(r.toOutlet as OutletId)}
            </span>
          );
        }
        if (r.direction === "out") {
          return (
            <span className="text-[var(--fg)]">
              {findOutletName(r.fromOutlet as OutletId)}
            </span>
          );
        }
        return (
          <span className="text-[var(--fg)]">
            {findOutletName(r.fromOutlet as OutletId)} →{" "}
            {findOutletName(r.toOutlet as OutletId)}
          </span>
        );
      },
    },
    {
      key: "qty",
      header: "Qty",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums font-medium">
          {r.qty} {r.unit}
        </span>
      ),
      sortBy: (r) => r.qty,
    },
    {
      key: "reason",
      header: "Reason",
      cell: (r) => (
        <span className="text-[var(--muted)]">{r.reason}</span>
      ),
      sortBy: (r) => r.reason,
    },
    {
      key: "actor",
      header: "Actor",
      cell: (r) => (
        <span className="text-[var(--muted)]">{r.actor}</span>
      ),
      sortBy: (r) => r.actor,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Workflow · Movement
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Stock movement
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Recent transfers, write-offs, and adjustments across every outlet.
            Filter by direction or location to drill in.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <ArrowRightLeft className="h-4 w-4" />
            New movement
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label="Inbound"
          value={inQty.toLocaleString("id-ID")}
          detail="Units received"
          tone="ok"
          icon={<ArrowDownLeft className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Outbound"
          value={outQty.toLocaleString("id-ID")}
          detail="Units issued"
          tone="bad"
          icon={<ArrowUpRight className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Transfers"
          value={transferQty.toLocaleString("id-ID")}
          detail="Outlet-to-outlet"
          tone="info"
          icon={<ArrowRightLeft className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="min-w-[220px] flex-1">
          <Field
            label="Search"
            placeholder="SKU, reason, or actor"
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
              <option value="WH">Central Warehouse</option>
              <option value="O1">Outlet 1</option>
              <option value="O2">Outlet 2</option>
              <option value="O3">Outlet 3</option>
              <option value="O4">Outlet 4</option>
              <option value="O5">Outlet 5</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1">
          {(
            [
              { id: "all" as DirectionFilter, label: "All" },
              { id: "in" as DirectionFilter, label: "Inbound" },
              { id: "transfer" as DirectionFilter, label: "Transfer" },
              { id: "out" as DirectionFilter, label: "Outbound" },
            ]
          ).map((t) => {
            const active = direction === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setDirection(t.id)}
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
        rowKey={(r) => r.id}
        initialSort={{ key: "date", dir: "desc" }}
        emptyTitle="No movements"
        emptyDescription="No stock movements match the current filters."
      />
    </div>
  );
}
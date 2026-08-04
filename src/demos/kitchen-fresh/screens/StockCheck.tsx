// src/demos/kitchen-fresh/screens/StockCheck.tsx
//
// Per-outlet stocktake checklist. Each row has expected vs counted numbers
// and a state badge (ok / low / out). The counted number can be adjusted
// with +/- buttons; doing so re-derives the state in real time.
//
// Rows are grouped by category (supplies / beverage / cleaning) for the
// same taxonomy you'd see in a real stocktake sheet.

import { useMemo, useState } from "react";
import { Minus, Plus, Package2, GlassWater, SprayCan } from "lucide-react";
import { useKitchenFresh } from "../context";
import { findOutlet } from "@/demos/_shared/fixtures/inventory";
import { STOCK_ROWS, type StockRow, type StockState } from "../mocks";
import { Badge } from "@/demos/_shared/Badge";
import { setDemoHash } from "@/demos/router";

type Filter = "all" | StockState;

const CATEGORY_META: Record<StockRow["category"], { label: string; icon: React.ReactNode }> = {
  supplies: { label: "Supplies & packaging", icon: <Package2 className="h-3.5 w-3.5" /> },
  beverage: { label: "Beverage", icon: <GlassWater className="h-3.5 w-3.5" /> },
  cleaning: { label: "Cleaning & consumables", icon: <SprayCan className="h-3.5 w-3.5" /> },
};

function deriveState(counted: number, expected: number): StockState {
  if (counted === 0) return "out";
  if (counted < expected * 0.5) return "low";
  return "ok";
}

export function StockCheck() {
  const { activeOutletId } = useKitchenFresh();
  const outlet = findOutlet(activeOutletId);
  const [filter, setFilter] = useState<Filter>("all");
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const baseRows = useMemo(
    () => STOCK_ROWS.filter((r) => r.outletId === activeOutletId),
    [activeOutletId],
  );

  const rows = useMemo<StockRow[]>(
    () =>
      baseRows.map((r) => {
        const counted = overrides[r.id] ?? r.counted;
        return { ...r, counted, state: deriveState(counted, r.expected) };
      }),
    [baseRows, overrides],
  );

  const counts = useMemo(
    () => ({
      total: rows.length,
      ok: rows.filter((r) => r.state === "ok").length,
      low: rows.filter((r) => r.state === "low").length,
      out: rows.filter((r) => r.state === "out").length,
    }),
    [rows],
  );

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.state === filter)),
    [rows, filter],
  );

  const grouped = useMemo(() => {
    const g: Record<StockRow["category"], StockRow[]> = {
      supplies: [],
      beverage: [],
      cleaning: [],
    };
    for (const r of filtered) g[r.category].push(r);
    return g;
  }, [filtered]);

  const adjust = (id: string, _expected: number, delta: number) => {
    setOverrides((prev) => {
      const base = baseRows.find((r) => r.id === id);
      if (!base) return prev;
      const current = prev[id] ?? base.counted;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Stocktake
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Stock Check</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Per-SKU counts for{" "}
            <strong style={{ color: "var(--fg)" }}>{outlet?.name}</strong> ({outlet?.code}).
            Adjust with the +/- buttons to re-derive the state.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Stat label="OK" value={counts.ok} tone="ok" />
          <Stat label="Low" value={counts.low} tone="warn" />
          <Stat label="Out" value={counts.out} tone="bad" />
        </div>
      </header>

      <div
        className="flex items-center gap-1 rounded-md border p-1 text-xs"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        {(["all", "ok", "low", "out"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="rounded-md px-3 py-1.5 font-medium uppercase tracking-wider transition-colors"
            style={{
              backgroundColor: filter === f ? "var(--bg)" : "transparent",
              color: filter === f ? "var(--fg)" : "var(--muted)",
              boxShadow: filter === f ? "inset 0 0 0 1px var(--border)" : "none",
            }}
          >
            {f === "all"
              ? `All (${counts.total})`
              : `${f} (${
                  f === "ok" ? counts.ok : f === "low" ? counts.low : counts.out
                })`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-md border border-dashed px-6 py-12 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No items match this filter.
        </div>
      ) : (
        <div className="space-y-5">
          {(Object.keys(grouped) as StockRow["category"][]).map((cat) => {
            const items = grouped[cat];
            if (items.length === 0) return null;
            const meta = CATEGORY_META[cat];
            return (
              <section
                key={cat}
                className="rounded-xl border"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <header
                  className="flex items-center gap-2 border-b px-4 py-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--accent)" }}>{meta.icon}</span>
                  <h3 className="text-sm font-semibold">{meta.label}</h3>
                  <span
                    className="ml-auto text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    {items.length} items
                  </span>
                </header>
                <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {items.map((row) => (
                    <StockRowView
                      key={row.id}
                      row={row}
                      onAdjust={(delta) => adjust(row.id, row.expected, delta)}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <div
        className="flex items-center justify-between text-xs"
        style={{ color: "var(--muted)" }}
      >
        <span>
          Showing {filtered.length} of {rows.length} stock items across{" "}
          {(Object.values(grouped).filter((g) => g.length > 0).length)} categories.
        </span>
        <button
          type="button"
          onClick={() => setDemoHash("kitchen-fresh", "outlets")}
          className="font-medium"
          style={{ color: "var(--accent)" }}
        >
          ← Switch outlet
        </button>
      </div>
    </div>
  );
}

function StockRowView({ row, onAdjust }: { row: StockRow; onAdjust: (delta: number) => void }) {
  return (
    <li
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>
            {row.item}
          </span>
          <span className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>
            {row.id}
          </span>
        </div>
        <div
          className="mt-0.5 flex items-center gap-2 text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          <span>Expected {row.expected}</span>
          <span aria-hidden>·</span>
          <span>Counted {row.counted}</span>
        </div>
      </div>

      <StateBadge state={row.state} />

      <div className="ml-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => onAdjust(-1)}
          aria-label={`Decrease count for ${row.item}`}
          className="flex h-7 w-7 items-center justify-center rounded-md border"
          style={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            backgroundColor: "var(--bg)",
          }}
        >
          <Minus className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onAdjust(+1)}
          aria-label={`Increase count for ${row.item}`}
          className="flex h-7 w-7 items-center justify-center rounded-md border"
          style={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            backgroundColor: "var(--bg)",
          }}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </li>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "bad";
}) {
  const color =
    tone === "ok"
      ? "var(--ok)"
      : tone === "warn"
        ? "var(--warn)"
        : "var(--bad)";
  return (
    <div
      className="flex items-center gap-1.5 rounded-md border px-2 py-1"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <span
        className="text-[10px] font-medium uppercase tracking-widest"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function StateBadge({ state }: { state: StockState }) {
  const tone = state === "ok" ? "ok" : state === "low" ? "warn" : "bad";
  return <Badge tone={tone as "ok" | "warn" | "bad"}>{state}</Badge>;
}
// src/demos/kitchen-fresh/screens/DailyOps.tsx
//
// Per-outlet prep timer grid. Mirrors the production `FoodGrid` layout:
// dense CSS-grid of prep tiles with status-colored backgrounds
// (good/alert/check/empty/replace), live time-remaining countdowns,
// per-tile reset, and a status filter.
//
// Clicking a tile cycles its state pending → in-progress → done.
// Clicking the reset icon sends the item back to "ready to start".

import { useMemo, useState } from "react";
import { Clock3, Filter, RotateCcw, Search } from "lucide-react";
import { useKitchenFresh } from "../context";
import { findOutlet } from "@/demos/_shared/fixtures/inventory";
import {
  formatTimeRemaining,
  getFreshnessStatus,
  type FreshnessStatus,
  type PrepItem,
} from "../mocks";
import { useTheme } from "@/demos/_shared/useTheme";
import { kitchenFreshTheme } from "@/demos/_shared/themes/kitchen-fresh";

type Filter = "all" | FreshnessStatus;

const STATUS_TONE: Record<FreshnessStatus, { bg: string; fg: string; label: string }> = {
  empty: { bg: "#e0e0e0", fg: "#1a1a1a", label: "Ready to start" },
  good: { bg: "#22c55e", fg: "#ffffff", label: "Good" },
  alert: { bg: "#f59e0b", fg: "#1a1a1a", label: "Alert" },
  check: { bg: "#ef4444", fg: "#ffffff", label: "Check" },
  replace: { bg: "#dc2626", fg: "#ffffff", label: "REPLACE NOW!" },
};

export function DailyOps() {
  const { activeOutletId, prepItems, cyclePrepStatus, resetPrepItem } = useKitchenFresh();
  useTheme(kitchenFreshTheme.id);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const outlet = findOutlet(activeOutletId);
  const rows = useMemo(
    () => prepItems.filter((p) => p.outletId === activeOutletId),
    [prepItems, activeOutletId],
  );

  const counts = useMemo(() => {
    const c: Record<FreshnessStatus, number> = {
      empty: 0,
      good: 0,
      alert: 0,
      check: 0,
      replace: 0,
    };
    for (const r of rows) c[getFreshnessStatus(r)]++;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filter !== "all") list = list.filter((r) => getFreshnessStatus(r) === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    }
    return list;
  }, [rows, filter, query]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Fresh Counter
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Daily Ops</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Live prep timer grid for{" "}
            <strong style={{ color: "var(--fg)" }}>{outlet?.name}</strong>{" "}
            ({outlet?.code}). Tap a tile to cycle its status. Use reset to send it back to ready.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <StatusPill status="good" count={counts.good} />
          <StatusPill status="alert" count={counts.alert} />
          <StatusPill status="check" count={counts.check} />
          <StatusPill status="replace" count={counts.replace} />
          <StatusPill status="empty" count={counts.empty} />
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-1 rounded-md border p-1 text-xs"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Filter className="ml-1 h-3 w-3" style={{ color: "var(--muted)" }} />
          {(["all", "good", "alert", "check", "empty"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="rounded-md px-3 py-1.5 font-medium capitalize transition-colors"
              style={{
                backgroundColor: filter === f ? "var(--bg)" : "transparent",
                color: filter === f ? "var(--fg)" : "var(--muted)",
                boxShadow: filter === f ? "inset 0 0 0 1px var(--border)" : "none",
              }}
            >
              {f === "all" ? `All (${rows.length})` : `${f} (${counts[f]})`}
            </button>
          ))}
        </div>

        <label
          className="flex h-9 items-center gap-2 rounded-md border px-2 text-sm"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Search className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find prep item…"
            className="w-44 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--fg)" }}
          />
        </label>

        <span
          className="ml-auto inline-flex items-center gap-1 text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          <Clock3 className="h-3 w-3" />
          {filtered.length} of {rows.length} items
        </span>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-md border border-dashed px-6 py-12 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No prep items match this filter.
        </div>
      ) : (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(220px, 1fr))",
            maxWidth: 1280,
          }}
        >
          {filtered.map((row) => (
            <PrepTile
              key={row.id}
              item={row}
              onCycle={() => cyclePrepStatus(row.id)}
              onReset={() => resetPrepItem(row.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, count }: { status: FreshnessStatus; count: number }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--muted)",
      }}
    >
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: tone.bg,
          border: status === "empty" ? "1px solid var(--border)" : "none",
        }}
        aria-hidden
      />
      <span className="text-[10px] font-medium uppercase tracking-widest">{status}</span>
      <span className="font-mono text-sm font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
        {count}
      </span>
    </span>
  );
}

function PrepTile({
  item,
  onCycle,
  onReset,
}: {
  item: PrepItem;
  onCycle: () => void;
  onReset: () => void;
}) {
  const status = getFreshnessStatus(item);
  const tone = STATUS_TONE[status];
  const remaining = Math.max(0, item.expirationMinutes - item.ageMinutes);

  return (
    <div
      className="relative flex h-[160px] flex-col overflow-hidden rounded-xl p-3 transition-shadow hover:shadow-md"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
      data-testid={`prep-tile-${item.id}`}
    >
      {/* Prep-time badge top-left */}
      {item.prepMinutes !== undefined && item.prepMinutes > 0 && (
        <div
          className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(234, 88, 12, 0.85)",
            color: "#ffffff",
          }}
        >
          {item.prepMinutes}m
        </div>
      )}

      {/* Reset button top-right */}
      {status !== "empty" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          aria-label={`Reset ${item.name}`}
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded transition-opacity hover:opacity-80"
          style={{ color: tone.fg }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Main content (clickable to cycle) */}
      <button
        type="button"
        onClick={onCycle}
        className="flex flex-1 flex-col items-center justify-center text-center"
        style={{ color: tone.fg }}
      >
        <h3 className="line-clamp-2 text-base font-bold leading-tight">{item.name}</h3>

        {status !== "empty" ? (
          <div className="mt-2 space-y-0.5">
            <div className="font-mono text-lg font-semibold tabular-nums">
              {formatTimeRemaining(remaining)}
            </div>
            <div className="text-[11px] uppercase tracking-wider">{tone.label}</div>
          </div>
        ) : (
          <div
            className="mt-2 text-[11px]"
            style={{ color: tone.fg, opacity: 0.7 }}
          >
            Ready to start
          </div>
        )}
      </button>

      {/* Footer meta */}
      <div
        className="mt-1 flex items-center justify-between text-[10px]"
        style={{ color: tone.fg, opacity: 0.75 }}
      >
        <span className="font-mono">{item.id}</span>
        <span>
          Par {item.parLevel} · {item.currentCount}/{item.parLevel}
        </span>
      </div>
    </div>
  );
}
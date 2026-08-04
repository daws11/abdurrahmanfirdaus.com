// src/demos/invenflow/screens/Stocktake.tsx
//
// Outlet tabs (WH + O1..O5). Per-row "Actual" cell is editable; the variance
// (Δ) column updates live. Save baseline pins the actual counts and locks the
// table. Print / Export CSV buttons are stubbed (no real file). Mirrors the
// production stocktake vocabulary (Pending / Match / Surplus / Short + pinned).

import { useMemo, useState } from "react";
import { Lock, Save, ScanLine, Printer, Download } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import { OUTLETS, STOCKTAKE_ROWS, skuLabel, type OutletId, type StocktakeRow } from "../mocks";

type Tab = OutletId;

const VARIANCE_REASONS = [
  "Counted correctly",
  "Damaged",
  "Spillage / breakage",
  "Customer return",
  "Stocktake correction",
  "Unit mismatch",
  "Other",
];

export default function Stocktake() {
  const [tab, setTab] = useState<Tab>("WH");
  const [rows, setRows] = useState<StocktakeRow[]>(STOCKTAKE_ROWS);
  const [pinned, setPinned] = useState(false);
  const [search, setSearch] = useState("");

  function setActual(sku: string, outlet: Tab, value: string) {
    const n = value === "" ? null : Number(value);
    setRows((rs) =>
      rs.map((r) =>
        r.sku === sku && r.outlet === outlet
          ? { ...r, actual: Number.isFinite(n) ? (n as number) : null }
          : r,
      ),
    );
  }
  function setReason(sku: string, outlet: Tab, reason: string) {
    setRows((rs) =>
      rs.map((r) =>
        r.sku === sku && r.outlet === outlet ? { ...r, reason } : r,
      ),
    );
  }
  function setNote(sku: string, outlet: Tab, note: string) {
    setRows((rs) =>
      rs.map((r) =>
        r.sku === sku && r.outlet === outlet ? { ...r, note } : r,
      ),
    );
  }

  function saveBaseline() {
    setRows((rs) =>
      rs.map((r) =>
        r.outlet === tab
          ? { ...r, pinned: true, projected: r.actual ?? r.projected }
          : r,
      ),
    );
    setPinned(true);
  }

  function reset() {
    setRows(STOCKTAKE_ROWS);
    setPinned(false);
    setSearch("");
  }

  const visible = useMemo(() => {
    let v = rows.filter((r) => r.outlet === tab);
    if (search) {
      const q = search.toLowerCase();
      v = v.filter((r) => skuLabel(r.sku).toLowerCase().includes(q));
    }
    return v;
  }, [rows, tab, search]);

  const counted = visible.filter((r) => r.actual !== null).length;
  const shortCount = visible.filter(
    (r) => r.actual !== null && r.actual < r.projected,
  ).length;
  const surplusCount = visible.filter(
    (r) => r.actual !== null && r.actual > r.projected,
  ).length;
  const totalDelta = visible.reduce(
    (s, r) => s + ((r.actual ?? r.projected) - r.projected),
    0,
  );

  function exportCsv() {
    const header = ["sku", "outlet", "projected", "actual", "delta", "reason"].join(",");
    const body = visible
      .map((r) => {
        const delta = r.actual === null ? "" : r.actual - r.projected;
        return [r.sku, r.outlet, r.projected, r.actual ?? "", delta, r.reason ?? ""].join(",");
      })
      .join("\n");
    // Synthetic file — no download. Just a console line so the action feels real.
    // eslint-disable-next-line no-console
    console.log(`[stocktake] export csv\n${header}\n${body}`);
  }
  function printSheet() {
    // eslint-disable-next-line no-console
    console.log(`[stocktake] print ${visible.length} rows for ${tab}`);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Workflow · Stocktake
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Stocktake · {OUTLETS.find((o) => o.id === tab)?.name}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Type into the{" "}
            <span className="font-medium text-[var(--fg)]">Actual</span> column
            to count on hand. Δ shows the live variance. Save the baseline
            when done.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={printSheet}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={saveBaseline}
            disabled={pinned}
          >
            {pinned ? <Lock className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {pinned ? "Baseline saved" : "Save baseline"}
          </Button>
        </div>
      </header>

      <div
        className="flex flex-wrap gap-1 border-b border-[var(--border)]"
        role="tablist"
        aria-label="Outlets"
      >
        {OUTLETS.map((o) => {
          const active = tab === o.id;
          const count = rows.filter((r) => r.outlet === o.id).length;
          return (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(o.id)}
              className="rounded-t-md px-3 py-2 text-sm font-medium transition-colors"
              style={{
                color: active ? "var(--fg)" : "var(--muted)",
                borderBottom: active
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                marginBottom: active ? -1 : 0,
                backgroundColor: active ? "var(--surface)" : "transparent",
              }}
            >
              {o.name}
              <span
                className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-medium tabular-nums"
                style={{
                  backgroundColor: active ? "var(--accent)" : "var(--border)",
                  color: active ? "var(--accent-fg)" : "var(--muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <StatTile
          label="Counted"
          value={`${counted} / ${visible.length}`}
          detail={`${visible.length - counted} pending`}
          tone="info"
        />
        <StatTile
          label="Short"
          value={shortCount.toString()}
          detail="Below baseline"
          tone={shortCount === 0 ? "neutral" : "bad"}
        />
        <StatTile
          label="Surplus"
          value={surplusCount.toString()}
          detail="Above baseline"
          tone={surplusCount === 0 ? "neutral" : "ok"}
        />
        <StatTile
          label="Net Δ"
          value={`${totalDelta >= 0 ? "+" : ""}${totalDelta}`}
          detail={pinned ? "Pinned" : "Live"}
          tone={totalDelta === 0 ? "neutral" : totalDelta > 0 ? "ok" : "bad"}
        />
      </div>

      <div className="flex max-w-sm items-center gap-2">
        <Field
          label="Search SKU"
          placeholder="e.g. SKU-001"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div
        className="overflow-hidden rounded-md border border-[var(--border)]"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="max-h-[28rem] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr
                className="border-b border-[var(--border)]"
                style={{ backgroundColor: "var(--bg)" }}
              >
                {[
                  "SKU",
                  "Projected",
                  "Actual",
                  "Δ",
                  "Reason",
                  "Note",
                  "Status",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={
                      "h-9 px-3 text-[11px] font-medium uppercase tracking-widest text-[var(--muted)] " +
                      (i === 1 || i === 2 || i === 3
                        ? "text-right"
                        : "text-left")
                    }
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const delta = r.actual === null ? null : r.actual - r.projected;
                return (
                  <tr
                    key={r.sku}
                    className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--bg)]"
                  >
                    <td className="h-10 px-3 text-[var(--fg)]">
                      {skuLabel(r.sku)}
                    </td>
                    <td className="h-10 px-3 text-right tabular-nums text-[var(--muted)]">
                      {r.projected}
                    </td>
                    <td className="h-10 px-3 text-right">
                      <input
                        type="number"
                        inputMode="numeric"
                        className="h-8 w-20 rounded-sm border bg-transparent px-2 text-right text-sm tabular-nums focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--fg)",
                        }}
                        value={r.actual ?? ""}
                        onChange={(e) => setActual(r.sku, tab, e.target.value)}
                        placeholder="—"
                        disabled={pinned}
                      />
                    </td>
                    <td className="h-10 px-3 text-right">
                      {delta === null ? (
                        <span className="text-[var(--muted)]">—</span>
                      ) : (
                        <span
                          className="tabular-nums"
                          style={{
                            color:
                              delta === 0
                                ? "var(--ok)"
                                : delta > 0
                                  ? "var(--accent)"
                                  : "var(--bad)",
                          }}
                        >
                          {delta > 0 ? "+" : ""}
                          {delta}
                        </span>
                      )}
                    </td>
                    <td className="h-10 px-3">
                      <select
                        value={r.reason ?? ""}
                        onChange={(e) => setReason(r.sku, tab, e.target.value)}
                        disabled={pinned || delta === null || delta === 0}
                        className="h-8 w-32 rounded-sm border bg-transparent px-2 text-xs focus:outline-none focus:ring-1 disabled:opacity-50"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--fg)",
                        }}
                      >
                        <option value="">— Select —</option>
                        {VARIANCE_REASONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="h-10 px-3">
                      <input
                        type="text"
                        placeholder="Optional"
                        value={r.note ?? ""}
                        onChange={(e) => setNote(r.sku, tab, e.target.value)}
                        disabled={pinned}
                        className="h-8 w-40 rounded-sm border bg-transparent px-2 text-xs focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--fg)",
                        }}
                      />
                    </td>
                    <td className="h-10 px-3">
                      {r.pinned ? (
                        <Badge tone="ok">
                          <Lock className="h-3 w-3" />
                          Pinned
                        </Badge>
                      ) : delta === null ? (
                        <Badge tone="neutral">Pending</Badge>
                      ) : delta === 0 ? (
                        <Badge tone="ok">Match</Badge>
                      ) : delta > 0 ? (
                        <Badge tone="info">Surplus</Badge>
                      ) : (
                        <Badge tone="bad">Short</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[var(--muted)]"
                  >
                    No SKUs configured for this location yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
        <ScanLine className="h-3.5 w-3.5" />
        Type into a cell to set the actual count. Δ updates immediately. Pick a
        reason for any non-zero variance — it shows up in the loss/gain report.
      </div>
    </div>
  );
}
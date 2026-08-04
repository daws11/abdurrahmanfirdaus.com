// src/demos/invenflow/screens/Dashboard.tsx
// @ts-nocheck
//
// Dashboard. Production exposes three tabs: Overview / Stocktake analysis /
// Board overview. We render the Overview tab with KPI tiles, trend chart
// (mock SVG), WorkQueueCard, AlertSummary, and VerificationCard. Tabs are
// inline so the reader can switch to the other two views without drilling.

import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowRightLeft,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Users,
  BellRing,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { setDemoHash } from "@/demos/router";
import type { InvenflowScreen } from "../routes";
import {
  ANALYTICS_TIMESERIES,
  INVENTORY_ROWS,
  MOVEMENT_ROWS,
  PERSONS,
  PURCHASE_ORDERS,
  RECEIVING_ROWS,
  STOCKTAKE_ROWS,
  ESCALATIONS,
} from "../mocks";

type TabId = "overview" | "stocktake" | "boards";

function Tabs({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "stocktake", label: "Stocktake analysis" },
    { id: "boards", label: "Board overview" },
  ];
  return (
    <div className="flex items-center gap-1 border-b" style={{ borderColor: "var(--border)" }}>
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="h-9 rounded-t-md px-3 text-xs font-medium transition-colors"
            style={{
              color: on ? "var(--fg)" : "var(--muted)",
              borderBottom: on ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function TrendChart() {
  const w = 720;
  const h = 220;
  const padX = 28;
  const padY = 20;
  const points = ANALYTICS_TIMESERIES;
  const max = Math.max(...points.flatMap((p) => [p.inbound, p.outbound, p.transfer]));
  const step = (w - padX * 2) / Math.max(1, points.length - 1);
  const toY = (v: number) => h - padY - ((h - padY * 2) * v) / max;
  const buildPath = (key: "inbound" | "outbound" | "transfer") =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${padX + i * step} ${toY(p[key])}`)
      .join(" ");
  return (
    <div
      className="rounded-md border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <header className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" style={{ color: "var(--muted)" }} />
          <h3 className="text-sm font-semibold">Movement trends — last 30 days</h3>
        </div>
        <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--muted)" }}>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--ok)" }} />
            Inbound
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--bad)" }} />
            Outbound
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            Transfer
          </span>
        </div>
      </header>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Movement trends">
        <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} stroke="var(--border)" />
        <line x1={padX} y1={padY} x2={padX} y2={h - padY} stroke="var(--border)" />
        <path d={buildPath("inbound")} fill="none" stroke="var(--ok)" strokeWidth={2} />
        <path d={buildPath("outbound")} fill="none" stroke="var(--bad)" strokeWidth={2} />
        <path d={buildPath("transfer")} fill="none" stroke="var(--accent)" strokeWidth={2} />
      </svg>
    </div>
  );
}

function WorkQueue({
  title,
  items,
  href,
  emptyHint,
}: {
  title: string;
  items: { id: string; label: string; sub: string; tone?: "ok" | "warn" | "bad" | "info" }[];
  href: InvenflowScreen;
  emptyHint: string;
}) {
  return (
    <div
      className="rounded-md border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <header className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => setDemoHash("invenflow", href)}
          className="text-[11px] font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          View all
        </button>
      </header>
      <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
        {items.length === 0 && (
          <li className="px-4 py-6 text-center text-[11px]" style={{ color: "var(--muted)" }}>
            {emptyHint}
          </li>
        )}
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-3 px-4 py-3">
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  it.tone === "bad"
                    ? "var(--bad)"
                    : it.tone === "warn"
                      ? "var(--warn)"
                      : it.tone === "ok"
                        ? "var(--ok)"
                        : "var(--accent)",
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>
                {it.label}
              </div>
              <div className="truncate text-[11px]" style={{ color: "var(--muted)" }}>
                {it.sub}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AlertSummary() {
  const alerts = useMemo(() => {
    const lowStock = INVENTORY_ROWS.filter((r) => r.reorder > 0).slice(0, 4);
    const pendingMoves = MOVEMENT_ROWS.filter((m) => m.status === "Pending Confirmation").slice(0, 3);
    const overdueReceiving = RECEIVING_ROWS.filter((r) => r.status === "in_transit").slice(0, 3);
    return { lowStock, pendingMoves, overdueReceiving };
  }, []);
  return (
    <div
      className="rounded-md border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <header className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" style={{ color: "var(--warn)" }} />
          <h3 className="text-sm font-semibold">Alert summary</h3>
        </div>
        <Badge tone="warn">{alerts.lowStock.length + alerts.pendingMoves.length + alerts.overdueReceiving.length}</Badge>
      </header>
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            <span>Low stock</span>
            <button type="button" onClick={() => setDemoHash("invenflow", "inventory")} className="text-[10px] hover:underline" style={{ color: "var(--accent)" }}>
              View inventory
            </button>
          </div>
          <ul className="space-y-1.5">
            {alerts.lowStock.map((r) => (
              <li key={r.sku + r.outlet} className="flex items-center justify-between text-xs">
                <span className="truncate">{r.sku} · {r.outlet}</span>
                <Badge tone="warn">+{r.reorder}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            <span>Pending confirmation</span>
            <button type="button" onClick={() => setDemoHash("invenflow", "movements")} className="text-[10px] hover:underline" style={{ color: "var(--accent)" }}>
              View movement
            </button>
          </div>
          <ul className="space-y-1.5">
            {alerts.pendingMoves.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-xs">
                <span className="truncate">{m.id}</span>
                <Badge tone="warn">Pending</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            <span>In transit</span>
            <button type="button" onClick={() => setDemoHash("invenflow", "receiving")} className="text-[10px] hover:underline" style={{ color: "var(--accent)" }}>
              View receiving
            </button>
          </div>
          <ul className="space-y-1.5">
            {alerts.overdueReceiving.map((r) => (
              <li key={r.poId} className="flex items-center justify-between text-xs">
                <span className="truncate">{r.poId}</span>
                <Badge tone="info">In transit</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StockByUnit() {
  const breakdown = useMemo(() => {
    const byTag: Record<string, { count: number; qty: number }> = {};
    for (const r of INVENTORY_ROWS) {
      const sku = (window as any).__INVENFLOW_SKUS_BY_CODE?.[r.sku];
      const tag = sku?.tag ?? "stock";
      if (!byTag[tag]) byTag[tag] = { count: 0, qty: 0 };
      byTag[tag].count += 1;
      byTag[tag].qty += r.onHand;
    }
    return byTag;
  }, []);
  const rows = Object.entries(breakdown).map(([k, v]) => ({ label: k, ...v }));
  const total = rows.reduce((s, r) => s + r.qty, 0);
  return (
    <div
      className="rounded-md border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <header className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold">Stock by unit</h3>
      </header>
      <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
        {rows.map((r) => {
          const pct = total > 0 ? Math.round((r.qty / total) * 100) : 0;
          return (
            <li key={r.label} className="flex items-center gap-3 px-4 py-3 text-xs">
              <span className="w-24 capitalize" style={{ color: "var(--fg)" }}>{r.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg)" }}>
                <div className="h-full" style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }} />
              </div>
              <span className="w-20 text-right tabular-nums" style={{ color: "var(--muted)" }}>
                {r.qty.toLocaleString("id-ID")}
              </span>
              <span className="w-12 text-right tabular-nums" style={{ color: "var(--muted)" }}>
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useStateLite<TabId>("overview");

  const totalValue = PURCHASE_ORDERS.reduce((s, p) => s + p.total, 0);
  const inbound = MOVEMENT_ROWS.filter((m) => m.direction === "in").reduce((s, m) => s + m.qty, 0);
  const outbound = MOVEMENT_ROWS.filter((m) => m.direction === "out").reduce((s, m) => s + m.qty, 0);
  const totalStocktake = STOCKTAKE_ROWS.length;
  const activePersons = PERSONS.filter((p) => p.active).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Overview</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">Dashboard</h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            What needs attention across the warehouse right now. Switch to <em>Stocktake analysis</em> or
            <em> Board overview</em> for deeper views.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <ArrowRightLeft className="h-4 w-4" />
            New movement
          </Button>
          <Button variant="primary" size="sm">
            <ClipboardList className="h-4 w-4" />
            New stocktake
          </Button>
        </div>
      </header>

      <Tabs active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <StatTile
              label="PO value (open)"
              value={`Rp ${(totalValue / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}M`}
              detail={`${PURCHASE_ORDERS.length} POs`}
              tone="accent"
              icon={<DollarSign className="h-3.5 w-3.5" />}
            />
            <StatTile
              label="Inbound units"
              value={inbound.toLocaleString("id-ID")}
              detail="Last 30 days"
              tone="ok"
              icon={<ArrowDownLeft className="h-3.5 w-3.5" />}
            />
            <StatTile
              label="Outbound units"
              value={outbound.toLocaleString("id-ID")}
              detail="Last 30 days"
              tone="bad"
              icon={<ArrowRightLeft className="h-3.5 w-3.5" />}
            />
            <StatTile
              label="Stocktake rows"
              value={totalStocktake.toLocaleString("id-ID")}
              detail={`${activePersons} active team`}
              tone="info"
              icon={<Users className="h-3.5 w-3.5" />}
            />
          </div>

          <TrendChart />

          <AlertSummary />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <WorkQueue
              title="Work queue — Purchasing"
              href="boards-purchasing"
              emptyHint="Nothing waiting for purchase"
              items={PURCHASE_ORDERS.filter((p) => p.stage === "new").slice(0, 5).map((p) => ({
                id: p.id,
                label: `${p.id} · ${p.vendor}`,
                sub: `Rp ${(p.total / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}K · ${p.lines.length} lines`,
                tone: p.priority === "urgent" ? "bad" : p.priority === "high" ? "warn" : "info",
              }))}
            />
            <WorkQueue
              title="Work queue — Receiving"
              href="boards-receiving"
              emptyHint="Nothing waiting for receiving"
              items={RECEIVING_ROWS.filter((r) => r.status !== "received").slice(0, 5).map((r) => ({
                id: r.poId,
                label: `${r.poId} · ${r.vendor}`,
                sub: `ETA ${r.eta} · ${r.carrier}`,
                tone: r.status === "arrived" ? "warn" : "info",
              }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <StockByUnit />
            <div
              className="rounded-md border"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <header className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" style={{ color: "var(--bad)" }} />
                  <h3 className="text-sm font-semibold">Live escalations</h3>
                </div>
                <button type="button" onClick={() => setDemoHash("invenflow", "escalations")} className="text-[11px] font-medium hover:underline" style={{ color: "var(--accent)" }}>
                  View all
                </button>
              </header>
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {ESCALATIONS.filter((e) => e.status !== "resolved").slice(0, 5).map((e) => (
                  <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                    <Badge tone={e.severity === "critical" ? "bad" : e.severity === "high" ? "warn" : "info"}>
                      {e.severity}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{e.trigger}</div>
                      <div className="truncate text-[11px]" style={{ color: "var(--muted)" }}>
                        {e.description}
                      </div>
                    </div>
                    <span className="text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
                      {e.raisedAt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "stocktake" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <StatTile label="Counted" value={`${STOCKTAKE_ROWS.filter((r) => r.actual !== null).length}`} tone="ok" icon={<ClipboardList className="h-3.5 w-3.5" />} />
            <StatTile label="Pending" value={`${STOCKTAKE_ROWS.filter((r) => r.actual === null).length}`} tone="warn" />
            <StatTile label="Short" value={`${STOCKTAKE_ROWS.filter((r) => r.actual !== null && r.actual < r.projected).length}`} tone="bad" />
            <StatTile label="Surplus" value={`${STOCKTAKE_ROWS.filter((r) => r.actual !== null && r.actual > r.projected).length}`} tone="info" />
          </div>
          <div
            className="rounded-md border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <header className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold">Stocktake variance by SKU</h3>
              <span className="text-[11px]" style={{ color: "var(--muted)" }}>Top variance</span>
            </header>
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {STOCKTAKE_ROWS.slice(0, 12).map((r) => {
                const delta = r.actual !== null ? r.actual - r.projected : 0;
                return (
                  <li key={r.sku + r.outlet} className="flex items-center gap-3 px-4 py-3 text-xs">
                    <span className="w-24 truncate font-medium">{r.sku}</span>
                    <span className="w-12" style={{ color: "var(--muted)" }}>{r.outlet}</span>
                    <span className="ml-auto tabular-nums" style={{ color: "var(--muted)" }}>proj {r.projected}</span>
                    <span className="w-16 text-right tabular-nums">{r.actual ?? "—"}</span>
                    <Badge tone={delta > 0 ? "info" : delta < 0 ? "warn" : "ok"}>
                      {delta > 0 ? `+${delta}` : delta}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {tab === "boards" && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {[
            { id: "boards-purchasing" as InvenflowScreen, label: "Purchasing", count: PURCHASE_ORDERS.length },
            { id: "boards-receiving" as InvenflowScreen, label: "Receiving", count: RECEIVING_ROWS.length },
            { id: "boards-investment" as InvenflowScreen, label: "Payment Request", count: 18 },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setDemoHash("invenflow", b.id)}
              className="rounded-md border p-4 text-left transition-colors hover:shadow-md"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                Board
              </div>
              <div className="mt-1 text-base font-semibold">{b.label}</div>
              <div className="mt-2 text-2xl font-bold tabular-nums">{b.count}</div>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>cards</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Minimal local state hook to avoid pulling extra from React.
function useStateLite<T>(initial: T): [T, (v: T) => void] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return React.useState(initial);
}

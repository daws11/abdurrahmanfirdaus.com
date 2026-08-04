// src/demos/kitchen-fresh/screens/OutletSwitcher.tsx
//
// Five outlet cards showing today's prep summary for each outlet. Clicking a
// card sets the active outlet via context, which the other screens read.
//
// Visual style mirrors the production Dashboard layout: dense card grid
// (1 col mobile, 2 cols md, 3 cols lg) with per-outlet progress ring and
// freshness distribution (good/alert/check/empty/replace).

import { useKitchenFresh } from "../context";
import { OUTLETS, findOutlet } from "@/demos/_shared/fixtures/inventory";
import { summarizeOutlet, type OutletSummary } from "../mocks";
import { setDemoHash } from "@/demos/router";
import { ArrowRight, MapPin, Clock3 } from "lucide-react";

export function OutletSwitcher() {
  const { activeOutletId, setActiveOutlet } = useKitchenFresh();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-1">
        <div
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Kitchen Fresh
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Outlets</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Pick an outlet to load today's prep, stock, and shift handoff for
          that location.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {OUTLETS.filter((o) => o.id !== "WH").map((outlet) => {
          const summary = summarizeOutlet(outlet.id);
          const isActive = activeOutletId === outlet.id;
          return (
            <li key={outlet.id}>
              <OutletCard
                summary={summary}
                isActive={isActive}
                onSelect={() => {
                  setActiveOutlet(outlet.id);
                  setDemoHash("kitchen-fresh", "daily");
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function OutletCard({
  summary,
  isActive,
  onSelect,
}: {
  summary: OutletSummary;
  isActive: boolean;
  onSelect: () => void;
}) {
  const outlet = findOutlet(summary.outletId);
  const pct = summary.total ? Math.round((summary.done / summary.total) * 100) : 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className="block w-full rounded-xl border p-4 text-left transition-shadow hover:shadow-sm"
      style={{
        borderColor: isActive ? "var(--accent)" : "var(--border)",
        backgroundColor: "var(--surface)",
        boxShadow: isActive ? "0 0 0 1px var(--accent)" : "none",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            <MapPin className="h-3 w-3" />
            <span>Outlet</span>
          </div>
          <div className="mt-0.5 truncate text-base font-semibold">{outlet?.name}</div>
          <div
            className="mt-0.5 font-mono text-xs"
            style={{ color: "var(--muted)" }}
          >
            {outlet?.code}
          </div>
        </div>
        <ProgressRing pct={pct} />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Done" value={summary.done} tone="ok" />
        <Stat label="In progress" value={summary.inProgress} tone="warn" />
        <Stat label="Pending" value={summary.pending} tone="bad" />
      </dl>

      <FreshnessStrip summary={summary} />

      <div
        className="mt-4 flex items-center justify-between border-t pt-3 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <span className="flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {summary.total} prep items today
        </span>
        <span
          className="inline-flex items-center gap-1 font-medium"
          style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}
        >
          {isActive ? "Active" : "Open"}
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
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
    <div>
      <div
        className="text-[10px] font-medium uppercase tracking-widest"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-lg font-semibold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function FreshnessStrip({ summary }: { summary: OutletSummary }) {
  const entries: { key: keyof OutletSummary["freshness"]; label: string; color: string }[] = [
    { key: "good", label: "Good", color: "#22c55e" },
    { key: "alert", label: "Alert", color: "#f59e0b" },
    { key: "check", label: "Check", color: "#ef4444" },
    { key: "empty", label: "Empty", color: "var(--border)" },
    { key: "replace", label: "Replace", color: "#dc2626" },
  ];
  const total = summary.total || 1;
  return (
    <div className="mt-4 space-y-1.5">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full">
        {entries.map(({ key, color }) => {
          const n = summary.freshness[key];
          if (!n) return null;
          return (
            <span
              key={key}
              style={{ width: `${(n / total) * 100}%`, backgroundColor: color }}
              aria-label={`${key}: ${n}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
        {entries.map(({ key, label, color }) => (
          <span key={key} className="inline-flex items-center gap-1" style={{ color: "var(--muted)" }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: color, border: key === "empty" ? "1px solid var(--border)" : "none" }}
            />
            <span>
              {label} <strong style={{ color: "var(--fg)" }}>{summary.freshness[key]}</strong>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative h-12 w-12">
      <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 200ms ease-out" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums"
        style={{ color: "var(--fg)" }}
      >
        {pct}%
      </div>
    </div>
  );
}
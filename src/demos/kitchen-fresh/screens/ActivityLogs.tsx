// src/demos/kitchen-fresh/screens/ActivityLogs.tsx
// @ts-nocheck
//
// Production equivalent: LogsPage → ActivityLogs.tsx. Lists per-outlet
// log rows (started / refilled / expired / removed / reset) with the dish
// name, status badge, timestamp, and author.

import { useMemo, useState } from "react";
import { Search, Activity } from "lucide-react";
import { ACTIVITY_LOGS, FRESHNESS_HEX, type ActivityLogEntry, type FreshnessStatus } from "../mocks";

const ACTION_TONE: Record<ActivityLogEntry["action"], { bg: string; fg: string; label: string }> = {
  started: { bg: "#dcfce7", fg: "#15803d", label: "Started" },
  refilled: { bg: "#dbeafe", fg: "#1d4ed8", label: "Refilled" },
  expired: { bg: "#fee2e2", fg: "#b91c1c", label: "Expired" },
  removed: { bg: "#fef3c7", fg: "#a16207", label: "Removed" },
  reset: { bg: "#f1f5f9", fg: "#475569", label: "Reset" },
};

type ActionFilter = "all" | ActivityLogEntry["action"];

export function ActivityLogs() {
  const [action, setAction] = useState<ActionFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = ACTIVITY_LOGS;
    if (action !== "all") list = list.filter((l) => l.action === action);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.dishName.toLowerCase().includes(q) ||
          l.outletId.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q),
      );
    }
    return list;
  }, [action, query]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Activity Logs
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Kitchen Activity</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Live stream of dish timer actions — started, refilled, expired, removed, reset.
          </p>
        </div>
        <span
          className="rounded-md border px-2 py-1 text-xs"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Showing
          </span>{" "}
          <span className="font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
            {filtered.length} of {ACTIVITY_LOGS.length}
          </span>
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex flex-wrap items-center gap-1 rounded-md border p-1 text-xs"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Activity className="ml-1 h-3 w-3" style={{ color: "var(--muted)" }} />
          {(["all", "started", "refilled", "expired", "removed", "reset"] as ActionFilter[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAction(a)}
              className="rounded-md px-3 py-1.5 font-medium capitalize transition-colors"
              style={{
                backgroundColor: action === a ? "var(--bg)" : "transparent",
                color: action === a ? "var(--fg)" : "var(--muted)",
                boxShadow: action === a ? "inset 0 0 0 1px var(--border)" : "none",
              }}
            >
              {a === "all" ? "All actions" : ACTION_TONE[a].label}
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
            placeholder="Find by dish, outlet, user…"
            className="w-56 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--fg)" }}
          />
        </label>
      </div>

      <section
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left text-[10px] font-medium uppercase tracking-widest"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Outlet</th>
              <th className="px-4 py-2">Dish</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">By</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="border-b transition-colors last:border-b-0 hover:bg-black/[0.02]"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-2 font-mono text-xs">
                  {new Date(log.timestamp).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-2 font-mono text-xs">{log.outletId}</td>
                <td className="px-4 py-2 font-medium">{log.dishName}</td>
                <td className="px-4 py-2">
                  <ActionPill action={log.action} />
                </td>
                <td className="px-4 py-2">
                  <StatusPill status={log.status} />
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: "var(--muted)" }}>
                  {log.user}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="border-t border-dashed px-4 py-8 text-center text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  No log entries match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ActionPill({ action }: { action: ActivityLogEntry["action"] }) {
  const tone = ACTION_TONE[action];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {tone.label}
    </span>
  );
}

function StatusPill({ status }: { status: FreshnessStatus }) {
  const tone = FRESHNESS_HEX[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest"
      style={{
        backgroundColor: tone.bg,
        color: tone.fg,
        border: status === "empty" ? "1px solid var(--border)" : "none",
      }}
    >
      {status}
    </span>
  );
}

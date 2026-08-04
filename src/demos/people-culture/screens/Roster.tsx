// src/demos/people-culture/screens/Roster.tsx
//
// Per-outlet weekly roster. Self-contained: reads EMPLOYEES + OUTLETS
// from the v2 fixtures and builds a 7-day grid inline so the screen
// works without the v3 rosterFor() helper.

import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  AlertTriangle,
  ArrowLeftRight,
  Building2,
} from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { EmptyState } from "@/demos/_shared/EmptyState";
import { setDemoHash } from "@/demos/router";
import { EMPLOYEES, OUTLETS } from "../mocks";
import type { OutletId } from "@/demos/_shared/fixtures/inventory";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SHIFT_TONE: Record<
  string,
  { bg: string; fg: string; label: string }
> = {
  open: { bg: "rgba(245,158,11,0.10)", fg: "#B45309", label: "Open" },
  mid: { bg: "rgba(79,70,229,0.10)", fg: "#4F46E5", label: "Mid" },
  close: { bg: "rgba(139,92,246,0.10)", fg: "#7C3AED", label: "Close" },
  off: { bg: "transparent", fg: "var(--muted)", label: "Off" },
  leave: { bg: "rgba(244,63,94,0.08)", fg: "var(--bad)", label: "Leave" },
};

const ROLE_COLOR: Record<string, string> = {
  "Outlet Lead": "#4F46E5",
  "Shift Supervisor": "#7C3AED",
  Barista: "#0EA5E9",
  "Kitchen Staff": "#10B981",
  Trainer: "#F59E0B",
  "Warehouse Lead": "#0EA5E9",
  "Warehouse Staff": "#0EA5E9",
  "HR Coordinator": "#EC4899",
  "Finance Lead": "#F43F5E",
};

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function shiftFor(
  code: string,
  day: number,
  status: string,
): { shift: string; startTime: string; endTime: string } {
  if (status === "on-leave") return { shift: "leave", startTime: "—", endTime: "—" };
  const cycle = (code.charCodeAt(code.length - 1) + day) % 7;
  if (cycle === 0) return { shift: "off", startTime: "—", endTime: "—" };
  if (cycle === 1 || cycle === 4) return { shift: "open", startTime: "06:00", endTime: "14:00" };
  if (cycle === 2 || cycle === 5) return { shift: "mid", startTime: "10:00", endTime: "18:00" };
  return { shift: "close", startTime: "14:00", endTime: "22:00" };
}

function shiftHours(shift: string): number {
  if (shift === "open") return 8;
  if (shift === "mid") return 8;
  if (shift === "close") return 8;
  return 0;
}

export function Roster() {
  const [outletId, setOutletId] = useState<OutletId>("O1");
  const [weekOffset, setWeekOffset] = useState(0);

  const outlet = OUTLETS.find((o) => o.id === outletId);
  const outletEmployees = useMemo(
    () => EMPLOYEES.filter((e) => e.outletId === outletId),
    [outletId],
  );

  const stats = useMemo(() => {
    let totalShifts = 0;
    let filled = 0;
    const slotCount: Record<string, number> = {
      open: 0,
      mid: 0,
      close: 0,
      off: 0,
      leave: 0,
    };
    for (const e of outletEmployees) {
      for (let d = 0; d < 7; d++) {
        const s = shiftFor(e.code, d, e.status);
        slotCount[s.shift] = (slotCount[s.shift] ?? 0) + 1;
        if (s.shift === "open" || s.shift === "mid" || s.shift === "close") {
          totalShifts += 1;
          filled += 1;
        }
      }
    }
    const coverage =
      totalShifts > 0 ? Math.round((filled / totalShifts) * 100) : 0;
    return {
      totalShifts,
      coverage,
      openUnfilled: Math.max(0, 6 - slotCount.open),
      swaps: 3,
      slots: slotCount,
    };
  }, [outletEmployees]);

  const weekRange = (() => {
    const start = new Date("2026-07-27");
    start.setDate(start.getDate() + weekOffset * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    return `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
  })();

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            Workforce · Roster
          </div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
            Weekly schedule for {outlet?.name ?? outletId}
          </h1>
          <p
            className="mt-1 max-w-2xl text-[12.5px]"
            style={{ color: "var(--muted)" }}
          >
            Publish shifts, see open coverage at a glance, and click any
            row to jump to the employee&apos;s directory record.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={outletId}
            onChange={(e) => setOutletId(e.target.value as OutletId)}
            className="h-9 rounded-md border bg-transparent px-3 text-[12.5px] focus:outline-none focus:ring-1"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            aria-label="Select outlet"
          >
            {OUTLETS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <Button variant="secondary" size="sm">
            <Calendar className="h-3.5 w-3.5" />
            Publish week
          </Button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div
            className="flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-[var(--bg)]"
                style={{ borderColor: "var(--border)" }}
                aria-label="Previous week"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="rounded-md border px-3 py-1 text-[11px] font-medium hover:bg-[var(--bg)]"
                style={{ borderColor: "var(--border)" }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-[var(--bg)]"
                style={{ borderColor: "var(--border)" }}
                aria-label="Next week"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span
                className="font-mono text-[13px] font-medium tabular-nums"
                style={{ color: "var(--fg)" }}
              >
                {weekRange}
              </span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              {(["open", "mid", "close", "leave"] as const).map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 text-[10.5px] font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: SHIFT_TONE[s].fg }}
                    aria-hidden="true"
                  />
                  {SHIFT_TONE[s].label}
                </span>
              ))}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-2xl border shadow-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg)",
                    }}
                  >
                    <th
                      className="h-9 px-3 text-left text-[11px] font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted)" }}
                    >
                      Employee
                    </th>
                    {DAY_LABELS.map((d, i) => (
                      <th
                        key={d}
                        className="h-9 px-2 text-center text-[11px] font-medium uppercase tracking-widest"
                        style={{ color: "var(--muted)", width: 86 }}
                      >
                        <div>{d}</div>
                        <div
                          className="font-mono text-[10px] tabular-nums"
                          style={{ color: "var(--muted)" }}
                        >
                          {(() => {
                            const start = new Date("2026-07-27");
                            start.setDate(
                              start.getDate() + weekOffset * 7 + i,
                            );
                            return start.getDate().toString().padStart(2, "0");
                          })()}
                        </div>
                      </th>
                    ))}
                    <th
                      className="h-9 px-3 text-right text-[11px] font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted)", width: 80 }}
                    >
                      Hrs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {outletEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6">
                        <EmptyState title="No staff assigned" />
                      </td>
                    </tr>
                  ) : (
                    outletEmployees.map((emp) => {
                      const totalHours = Array.from({ length: 7 }).reduce<number>(
                        (s, _, d) =>
                          s + shiftHours(shiftFor(emp.code, d, emp.status).shift),
                        0,
                      );
                      const roleColor = ROLE_COLOR[emp.role] ?? "#4F46E5";
                      return (
                        <tr
                          key={emp.code}
                          onClick={() =>
                            setDemoHash(
                              "people-culture",
                              `employee/${emp.code}`,
                            )
                          }
                          className="cursor-pointer border-b last:border-b-0 transition-colors hover:bg-[var(--bg)]"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <td className="h-10 px-3 align-middle">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                                style={{
                                  backgroundColor: `${roleColor}15`,
                                  color: roleColor,
                                }}
                                aria-hidden="true"
                              >
                                {initials(emp.name)}
                              </span>
                              <div className="min-w-0">
                                <div
                                  className="truncate text-[12.5px] font-medium"
                                  style={{ color: "var(--fg)" }}
                                >
                                  {emp.name}
                                </div>
                                <div
                                  className="truncate text-[10.5px]"
                                  style={{ color: "var(--muted)" }}
                                >
                                  {emp.role}
                                </div>
                              </div>
                            </div>
                          </td>
                          {Array.from({ length: 7 }).map((_, day) => {
                            const s = shiftFor(emp.code, day, emp.status);
                            const tone = SHIFT_TONE[s.shift];
                            return (
                              <td
                                key={day}
                                className="h-10 px-2 text-center align-middle"
                              >
                                <span
                                  className="inline-flex h-7 min-w-[60px] items-center justify-center rounded-md px-2 text-[10.5px] font-medium"
                                  style={{
                                    backgroundColor: tone.bg,
                                    color: tone.fg,
                                  }}
                                >
                                  {tone.label}
                                </span>
                              </td>
                            );
                          })}
                          <td
                            className="h-10 px-3 text-right align-middle tabular-nums"
                            style={{ color: "var(--fg)" }}
                          >
                            <span className="font-mono text-[12px]">
                              {totalHours}h
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--muted)" }}
            >
              Week coverage
            </div>
            <h2 className="mt-1 text-[14px] font-semibold">{outlet?.name}</h2>

            <dl className="mt-4 space-y-3">
              <StatRow
                icon={<Clock className="h-3.5 w-3.5" />}
                label="Total shifts"
                value={stats.totalShifts}
                tone="accent"
              />
              <StatRow
                icon={<Users className="h-3.5 w-3.5" />}
                label="Coverage"
                value={`${stats.coverage}%`}
                tone="ok"
              />
              <StatRow
                icon={<AlertTriangle className="h-3.5 w-3.5" />}
                label="Open shifts unfilled"
                value={stats.openUnfilled}
                tone="warn"
              />
              <StatRow
                icon={<ArrowLeftRight className="h-3.5 w-3.5" />}
                label="Swap requests"
                value={stats.swaps}
                tone="info"
              />
            </dl>

            <div
              className="mt-4 border-t pt-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--muted)" }}
              >
                Slot mix
              </div>
              <ul className="mt-2 space-y-2">
                {(["open", "mid", "close", "off", "leave"] as const).map((s) => (
                  <li
                    key={s}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: SHIFT_TONE[s].fg }}
                        aria-hidden="true"
                      />
                      {SHIFT_TONE[s].label}
                    </span>
                    <span
                      className="font-mono tabular-nums"
                      style={{ color: "var(--muted)" }}
                    >
                      {stats.slots[s] ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div className="flex items-center gap-2 text-[12.5px]">
              <Building2 className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
              <span style={{ color: "var(--fg)" }}>{outlet?.name}</span>
            </div>
            <p
              className="mt-2 text-[11.5px] leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {outletEmployees.length} staff assigned this week. Coverage
              assumes every published slot is filled; unfilled slots show
              up under "Open shifts unfilled".
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone: "accent" | "ok" | "warn" | "info";
}) {
  const toneColor =
    tone === "accent"
      ? "var(--accent)"
      : tone === "ok"
        ? "var(--ok)"
        : tone === "warn"
          ? "var(--warn)"
          : "var(--muted)";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[11.5px]" style={{ color: "var(--muted)" }}>
        {icon}
        {label}
      </div>
      <span
        className="font-mono text-[13px] font-semibold tabular-nums"
        style={{ color: toneColor }}
      >
        {value}
      </span>
    </div>
  );
}

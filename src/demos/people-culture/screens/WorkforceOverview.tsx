// src/demos/people-culture/screens/WorkforceOverview.tsx
//
// Workforce overview. Stat tiles at the top + a per-outlet headcount
// breakdown (active / onboarding / offboarding / on-leave) + department
// mix + a 30-day trend sparkline. Each outlet row links back to the
// directory via a `?outlet=...` filter (in this prototype, just visual).

import { useMemo } from "react";
import {
  Briefcase,
  UserMinus,
  UserPlus,
  Users,
  TrendingUp,
  Building2,
  Cake,
  ChevronRight,
  CircleDot,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { StatTile } from "@/demos/_shared/StatTile";
import {
  DEPARTMENT_HEADCOUNT,
  OUTLET_HEADCOUNT,
  OUTLETS,
  WORKFORCE_TOTALS,
} from "../mocks";
import type { OutletHeadcount } from "../mocks";

// Synthetic 30-day headcount trend. Generates 30 data points so the
// sparkline area is a deterministic curve, not random noise.
function buildHeadcountTrend(): { date: string; total: number; active: number }[] {
  const result: { date: string; total: number; active: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date("2026-08-03");
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    // Pretend headcount grew slightly over the window, with a small wobble.
    const total = WORKFORCE_TOTALS.headcount - 4 + Math.round(Math.sin(i / 4) * 2) + (29 - i) * 0.1;
    const active = total - 1 - Math.round(Math.cos(i / 3) * 1.5);
    result.push({
      date: iso,
      total: Math.round(total),
      active: Math.max(0, Math.round(active)),
    });
  }
  return result;
}

function buildStatusMix(): { status: string; count: number; tone: "ok" | "warn" | "bad" | "info" }[] {
  return [
    { status: "Active", count: WORKFORCE_TOTALS.active, tone: "ok" },
    { status: "Onboarding", count: WORKFORCE_TOTALS.onboarding, tone: "warn" },
    { status: "Offboarding", count: WORKFORCE_TOTALS.offboarding, tone: "bad" },
    { status: "On leave", count: WORKFORCE_TOTALS.onLeave, tone: "info" },
  ];
}

export function WorkforceOverview() {
  const trend = useMemo(() => buildHeadcountTrend(), []);
  const maxOutletTotal = Math.max(...OUTLET_HEADCOUNT.map((o) => o.total), 1);
  const maxTrend = Math.max(...trend.map((p) => p.total), 1);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            Workforce · Overview
          </div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
            Headcount by outlet and role
          </h1>
          <p
            className="mt-1 max-w-2xl text-[12.5px]"
            style={{ color: "var(--muted)" }}
          >
            A snapshot of who is active, who is onboarding, and who is on
            their way out. Drill into the directory to review individual
            records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="info">Last updated 2026-08-03</Badge>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Headcount"
          value={WORKFORCE_TOTALS.headcount}
          detail={`${WORKFORCE_TOTALS.avgTenureMonths} mo avg tenure`}
          tone="accent"
          icon={<Users className="h-4 w-4" />}
        />
        <StatTile
          label="Active"
          value={WORKFORCE_TOTALS.active}
          detail="Currently scheduled"
          tone="ok"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <StatTile
          label="Onboarding"
          value={WORKFORCE_TOTALS.onboarding}
          detail="In their first 90 days"
          tone="warn"
          icon={<UserPlus className="h-4 w-4" />}
        />
        <StatTile
          label="Offboarding"
          value={WORKFORCE_TOTALS.offboarding + WORKFORCE_TOTALS.onLeave}
          detail={`${WORKFORCE_TOTALS.offboarding} leaving · ${WORKFORCE_TOTALS.onLeave} on leave`}
          tone="bad"
          icon={<UserMinus className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <header className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--muted)" }}
              >
                Outlets
              </div>
              <h2 className="mt-1 text-[14px] font-semibold">
                Headcount by location
              </h2>
            </div>
            <span
              className="text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              {OUTLETS.length} locations
            </span>
          </header>

          <ul className="mt-4 space-y-2.5">
            {OUTLET_HEADCOUNT.map((row: OutletHeadcount) => (
              <OutletRow
                key={row.outletId}
                row={row}
                maxTotal={maxOutletTotal}
              />
            ))}
          </ul>

          <div
            className="mt-5 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            <header className="flex items-center justify-between">
              <div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--muted)" }}
                >
                  30-day trend
                </div>
                <h3 className="mt-1 text-[13px] font-semibold">
                  Total headcount
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--muted)" }}>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--ok)" }}
                  />
                  Active
                </span>
              </div>
            </header>
            <Sparkline data={trend} max={maxTrend} />
          </div>
        </section>

        <div className="space-y-5">
          <section
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
              Status mix
            </div>
            <h2 className="mt-1 text-[14px] font-semibold">By lifecycle</h2>
            <ul className="mt-4 space-y-3">
              {buildStatusMix().map((s) => {
                const pct = Math.round((s.count / WORKFORCE_TOTALS.headcount) * 100);
                return (
                  <li key={s.status}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="flex items-center gap-1.5">
                        <CircleDot
                          className="h-3 w-3"
                          style={{
                            color:
                              s.tone === "ok"
                                ? "var(--ok)"
                                : s.tone === "warn"
                                  ? "var(--warn)"
                                  : s.tone === "info"
                                    ? "var(--accent)"
                                    : "var(--bad)",
                          }}
                        />
                        {s.status}
                      </span>
                      <span
                        className="font-mono tabular-nums"
                        style={{ color: "var(--muted)" }}
                      >
                        {s.count} · {pct}%
                      </span>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full"
                      style={{ backgroundColor: "var(--bg)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            s.tone === "ok"
                              ? "var(--ok)"
                              : s.tone === "warn"
                                ? "var(--warn)"
                                : s.tone === "info"
                                  ? "var(--accent)"
                                  : "var(--bad)",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
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
              Departments
            </div>
            <h2 className="mt-1 text-[14px] font-semibold">By department</h2>
            <ul className="mt-4 space-y-2.5">
              {DEPARTMENT_HEADCOUNT.map((d) => {
                const pct = Math.round((d.count / WORKFORCE_TOTALS.headcount) * 100);
                return (
                  <li key={d.department}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span>{d.department}</span>
                      <span
                        className="font-mono tabular-nums"
                        style={{ color: "var(--muted)" }}
                      >
                        {d.count} · {pct}%
                      </span>
                    </div>
                    <div
                      className="mt-1 h-1 overflow-hidden rounded-full"
                      style={{ backgroundColor: "var(--bg)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: "var(--accent)",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
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
              Upcoming
            </div>
            <h2 className="mt-1 text-[14px] font-semibold">This week</h2>
            <ul className="mt-3 space-y-2.5 text-[12.5px]">
              <UpcomingRow
                icon={<Cake className="h-3.5 w-3.5" />}
                title="3 birthdays this week"
                detail="Anggi B., Candra P., Vina S."
              />
              <UpcomingRow
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                title="2 employees hit 1-year mark"
                detail="Bagas A., Kirana R."
              />
              <UpcomingRow
                icon={<UserPlus className="h-3.5 w-3.5" />}
                title="5 onboarding kickoffs scheduled"
                detail="Welcome orientations on Mon + Wed"
              />
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function OutletRow({
  row,
  maxTotal,
}: {
  row: OutletHeadcount;
  maxTotal: number;
}) {
  const widthPct = (row.total / maxTotal) * 100;
  return (
    <li
      className="rounded-xl border p-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[11px]"
            style={{
              backgroundColor: "rgba(79,70,229,0.08)",
              color: "#4F46E5",
            }}
            aria-hidden="true"
          >
            {row.outletId}
          </span>
          <div>
            <span className="text-[13px] font-medium">{row.outletName}</span>
            <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>
              {row.outletId === "WH" ? "Warehouse" : "Outlet"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[14px] font-semibold tabular-nums"
            style={{ color: "var(--fg)" }}
          >
            {row.total}
          </span>
          <ChevronRight
            className="h-3.5 w-3.5"
            style={{ color: "var(--muted)" }}
            aria-hidden="true"
          />
        </div>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${widthPct}%`,
            backgroundColor: "var(--accent)",
          }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10.5px]">
        <Badge tone="ok">{row.active} active</Badge>
        {row.onboarding > 0 && (
          <Badge tone="warn">{row.onboarding} onboarding</Badge>
        )}
        {row.offboarding > 0 && (
          <Badge tone="bad">{row.offboarding} offboarding</Badge>
        )}
        {row.onLeave > 0 && (
          <Badge tone="info">{row.onLeave} on leave</Badge>
        )}
      </div>
    </li>
  );
}

function Sparkline({
  data,
  max,
}: {
  data: { date: string; total: number; active: number }[];
  max: number;
}) {
  const w = 600;
  const h = 80;
  const stepX = w / Math.max(1, data.length - 1);

  function pathFor(key: "total" | "active"): string {
    return data
      .map((d, i) => {
        const x = i * stepX;
        const y = h - (d[key] / max) * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }

  const totalPath = pathFor("total");
  const activePath = pathFor("active");
  const last = data[data.length - 1];

  return (
    <div className="mt-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-20 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pcSparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${totalPath} L ${w},${h} L 0,${h} Z`}
          fill="url(#pcSparkFill)"
        />
        <path
          d={totalPath}
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={activePath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 3"
        />
      </svg>
      <div
        className="mt-1 flex items-center justify-between text-[10.5px]"
        style={{ color: "var(--muted)" }}
      >
        <span className="font-mono tabular-nums">{data[0].date}</span>
        <span className="flex items-center gap-1.5">
          <Building2 className="h-3 w-3" />
          Today: {last.total} total · {last.active} active
        </span>
        <span className="font-mono tabular-nums">{last.date}</span>
      </div>
    </div>
  );
}

function UpcomingRow({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--muted)",
        }}
      >
        {icon}
      </span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-[11px]" style={{ color: "var(--muted)" }}>
          {detail}
        </div>
      </div>
    </li>
  );
}

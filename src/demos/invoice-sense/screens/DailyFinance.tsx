// src/demos/invoice-sense/screens/DailyFinance.tsx
// @ts-nocheck
//
// Production "Daily Health Report" surface
// (client/src/pages/daily-finance-dashboard/components/DailyDashboard.tsx).
// Layout: page header with date picker + 4 key-metric tiles + Brand/Outlet
// breakdown table + Cashflow panel + 7-day revenue trend + hourly bar chart +
// Daily Analysis bullets.
//
// We render the same anatomy with synthetic aggregations from the INVOICES
// fixture. No external data fetches; all numbers are derived at render time.

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CircleDollarSign,
  Download,
  Receipt,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import {
  INVOICES,
  invoiceTotal,
  fmtCurrency,
  statusLabel,
} from "../mocks";

const OUTLETS = [
  "Kitchen-Central",
  "Outlet-Senopati",
  "Outlet-Kemang",
  "Outlet-Cipete",
  "Outlet-PIK",
  "Warehouse-Utama",
];

function StatTile({
  label,
  value,
  delta,
  tone,
  Icon,
}: {
  label: string;
  value: string;
  delta?: { value: number; positive: boolean };
  tone: "ok" | "warn" | "bad" | "info";
  Icon: typeof Receipt;
}) {
  return (
    <div
      className="rounded-md border p-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {label}
        </div>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{
            backgroundColor: `color-mix(in oklab, var(--${tone}) 14%, transparent)`,
            color: `var(--${tone})`,
          }}
        >
          <Icon className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-2 font-mono text-xl font-bold tabular-nums" style={{ color: "var(--fg)" }}>
        {value}
      </div>
      {delta && (
        <div className="mt-1 flex items-center gap-1 text-[10px]" style={{ color: delta.positive ? "var(--ok)" : "var(--bad)" }}>
          {delta.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{Math.abs(delta.value).toFixed(1)}% vs yesterday</span>
        </div>
      )}
    </div>
  );
}

export function DailyFinance() {
  // "Today" defaults to yesterday in production (closed-day convention).
  const yesterday = "2026-08-03";
  const [date, setDate] = useState(yesterday);

  const dayInvoices = useMemo(
    () => INVOICES.filter((i) => i.date === date),
    [date],
  );

  // Aggregations
  const dayRevenue = useMemo(() => dayInvoices.reduce((s, i) => s + invoiceTotal(i), 0), [dayInvoices]);
  const dayCount = dayInvoices.length;
  const errorCount = useMemo(() => INVOICES.filter((i) => i.status === "error").length, []);
  const reviewCount = useMemo(() => INVOICES.filter((i) => i.status === "needs_review").length, []);

  // Outlet revenue table
  const outletRows = useMemo(() => {
    return OUTLETS.map((outlet) => {
      const subset = INVOICES.filter((i) => i.receiver === outlet);
      const total = subset.reduce((s, i) => s + invoiceTotal(i), 0);
      return { outlet, total, count: subset.length };
    }).sort((a, b) => b.total - a.total);
  }, []);

  // 7-day trend (last 7 days, ending yesterday)
  const trend7d = useMemo(() => {
    const days: { date: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date("2026-08-03T00:00:00Z");
      d.setUTCDate(d.getUTCDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const total = INVOICES.filter((inv) => inv.date === iso).reduce((s, i) => s + invoiceTotal(i), 0);
      days.push({ date: iso, total });
    }
    return days;
  }, []);
  const trendMax = Math.max(1, ...trend7d.map((d) => d.total));

  // Hourly bars (synthetic distribution by hour bucket)
  const hourly = useMemo(() => {
    const buckets = new Array(12).fill(0).map((_, i) => ({
      hour: `${(8 + i).toString().padStart(2, "0")}:00`,
      count: 0,
    }));
    // Deterministic pseudo-spread
    for (let i = 0; i < dayCount; i++) {
      const idx = (i * 3 + dayInvoices[i].vendorCode.charCodeAt(0)) % buckets.length;
      buckets[idx].count += 1;
    }
    return buckets;
  }, [dayInvoices, dayCount]);

  // Recent activity (last 6 across all invoices)
  const recent = useMemo(
    () =>
      [...INVOICES]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [],
  );

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      {/* Page header */}
      <header
        className="flex flex-shrink-0 items-end justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight">Daily Health Report</h1>
          <p className="text-[12px]" style={{ color: "var(--muted)" }}>
            PT Unicorn Food and Services — All outlets combined
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Date
            </label>
            <div className="relative">
              <Calendar
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 rounded-md border pl-8 pr-3 text-[12px] focus:outline-none focus:ring-1"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--fg)" }}
              />
            </div>
          </div>
          <Button size="sm" variant="secondary">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button size="sm" variant="secondary">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-6">
        {/* Key metric tiles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Daily revenue" value={fmtCurrency(dayRevenue)} delta={{ value: 8.4, positive: true }} tone="ok" Icon={CircleDollarSign} />
          <StatTile label="Invoices processed" value={dayCount.toString()} delta={{ value: 3.1, positive: true }} tone="info" Icon={Receipt} />
          <StatTile label="Needs review" value={reviewCount.toString()} delta={{ value: 1.2, positive: false }} tone="warn" Icon={AlertCircle} />
          <StatTile label="Errors" value={errorCount.toString()} delta={{ value: 0.6, positive: false }} tone="bad" Icon={AlertCircle} />
        </div>

        {/* Outlet revenue table + Cashflow */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Outlet revenue */}
          <section className="rounded-md border" style={{ borderColor: "var(--border)" }}>
            <header
              className="flex items-center justify-between border-b px-4 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="text-[12px] font-semibold">Outlet revenue</h3>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                {date}
              </span>
            </header>
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                  <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Outlet</th>
                  <th className="px-3 py-2 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Invoices</th>
                  <th className="px-3 py-2 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {outletRows.map((r) => (
                  <tr key={r.outlet} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                    <td className="px-3 py-2" style={{ color: "var(--fg)" }}>{r.outlet}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums" style={{ color: "var(--muted)" }}>{r.count}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>{fmtCurrency(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Cashflow panel */}
          <section className="rounded-md border" style={{ borderColor: "var(--border)" }}>
            <header
              className="flex items-center justify-between border-b px-4 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="text-[12px] font-semibold">Cashflow</h3>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                {date}
              </span>
            </header>
            <div className="space-y-3 p-4 text-[12px]">
              <Row label="Cash central (PCC)" value={dayRevenue * 0.42} />
              <Row label="Cash outlet (PCO)" value={dayRevenue * 0.18} />
              <Row label="Bank transfer (TF)" value={dayRevenue * 0.40} />
              <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <Row label="Total inflow" value={dayRevenue} bold />
              </div>
            </div>
          </section>
        </div>

        {/* 7-day trend chart */}
        <section className="rounded-md border" style={{ borderColor: "var(--border)" }}>
          <header
            className="flex items-center justify-between border-b px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-[12px] font-semibold">Revenue trend · last 7 days</h3>
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
          </header>
          <div className="flex h-40 items-end gap-2 p-4">
            {trend7d.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(d.total / trendMax) * 100}%`,
                    backgroundColor: "var(--accent)",
                    minHeight: 4,
                  }}
                  title={`${d.date}: ${fmtCurrency(d.total)}`}
                />
                <span className="text-[9px] font-mono" style={{ color: "var(--muted)" }}>{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hourly bars */}
        <section className="rounded-md border" style={{ borderColor: "var(--border)" }}>
          <header
            className="flex items-center justify-between border-b px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-[12px] font-semibold">Hourly transactions · {date}</h3>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {hourly.reduce((s, h) => s + h.count, 0)} total
            </span>
          </header>
          <div className="flex h-28 items-end gap-1 p-4">
            {hourly.map((h) => {
              const max = Math.max(1, ...hourly.map((x) => x.count));
              return (
                <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${(h.count / max) * 100}%`,
                      backgroundColor:
                        h.count > 0
                          ? "color-mix(in oklab, var(--ok) 60%, transparent)"
                          : "var(--surface)",
                      minHeight: 3,
                    }}
                    title={`${h.hour}: ${h.count}`}
                  />
                  <span className="text-[8px] font-mono" style={{ color: "var(--muted)" }}>{h.hour.slice(0, 2)}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent activity */}
        <section className="rounded-md border" style={{ borderColor: "var(--border)" }}>
          <header
            className="flex items-center justify-between border-b px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-[12px] font-semibold">Recent activity</h3>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              last 6 invoices
            </span>
          </header>
          <ul>
            {recent.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center gap-3 border-b px-4 py-2 text-[12px] last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <Badge tone={
                  inv.status === "verified"
                    ? "ok"
                    : inv.status === "needs_review"
                      ? "warn"
                      : inv.status === "error"
                        ? "bad"
                        : "info"
                }>
                  {statusLabel(inv.status)}
                </Badge>
                <span className="flex-1 truncate" style={{ color: "var(--fg)" }}>{inv.vendor}</span>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>{inv.id}</span>
                <span className="font-mono text-[12px] tabular-nums" style={{ color: "var(--fg)" }}>
                  {fmtCurrency(invoiceTotal(inv), inv.currency)}
                </span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>{inv.date}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Daily analysis bullets */}
        <section
          className="rounded-md border p-4 text-[12px]"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Daily analysis
          </h3>
          <ul className="ml-4 list-disc space-y-1" style={{ color: "var(--fg)" }}>
            <li>Revenue {dayRevenue > 0 ? "up" : "flat"} versus yesterday — driven by {outletRows[0]?.outlet ?? "central kitchen"}.</li>
            <li>{reviewCount} invoices flagged for review; {errorCount} extraction errors pending re-upload.</li>
            <li>Bank-transfer share of inflow held steady at 40%.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : ""}`}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span className="font-mono tabular-nums" style={{ color: "var(--fg)" }}>{fmtCurrency(value)}</span>
    </div>
  );
}

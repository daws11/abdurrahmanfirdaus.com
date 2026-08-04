// src/demos/people-culture/screens/MyPay.tsx
//
// Self-service pay history. Reads the current user (EMP-001) from the
// fixtures and derives a 6-month pay history inline so the screen works
// without the v3 myPay() helper.

import {
  Wallet,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  ArrowDown,
  Check,
  Clock,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { findEmployee } from "../mocks";

function formatIdr(value: number): string {
  return `IDR ${new Intl.NumberFormat("id-ID").format(value)}`;
}

interface PayEntry {
  period: string;
  gross: number;
  net: number;
  status: "paid" | "pending" | "projected";
  deductions: { label: string; amount: number }[];
}

function buildHistory(base: number): PayEntry[] {
  const out: PayEntry[] = [];
  const tax = Math.round(base * 0.05);
  const bpjs = Math.round(base * 0.03);
  const transport = Math.round(base * 0.04);
  const meal = Math.round(base * 0.02);
  const deductions = [
    { label: "Income tax (PPh 21)", amount: tax },
    { label: "BPJS Ketenagakerjaan", amount: bpjs },
    { label: "Transport allowance", amount: transport },
    { label: "Meal allowance", amount: meal },
  ];
  for (let i = 5; i >= 0; i--) {
    const d = new Date("2026-08-03");
    d.setMonth(d.getMonth() - i - 1);
    const period = d.toISOString().slice(0, 7);
    const payDate = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);
    out.push({
      period,
      gross: base,
      net: base - tax - bpjs,
      status: i === 0 ? "pending" : i === 1 ? "projected" : "paid",
      deductions,
      // Synthetic "paid on" so the row stays informative.
      ...(i === 0 ? {} : { _paidOn: payDate }),
    } as PayEntry);
  }
  return out;
}

export function MyPay() {
  const employee = findEmployee("EMP-001");
  if (!employee) {
    return (
      <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>
        No employee record found.
      </div>
    );
  }
  const base = employee.payroll.baseSalaryIdr;
  const history = buildHistory(base);
  const ytd = history
    .filter((h) => h.period.startsWith("2026"))
    .reduce((s, h) => s + h.gross, 0);
  const last = history[history.length - 1];
  const nextPayDate = (() => {
    const d = new Date("2026-08-03");
    d.setMonth(d.getMonth() + 1, 0);
    return d.toISOString().slice(0, 10);
  })();
  const daysToPay = Math.max(
    0,
    Math.ceil(
      (new Date(nextPayDate).getTime() - new Date("2026-08-03").getTime()) /
        86400000,
    ),
  );

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            Self-service · My pay
          </div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
            My pay
          </h1>
          <p
            className="mt-1 max-w-2xl text-[12.5px]"
            style={{ color: "var(--muted)" }}
          >
            Pay history, deductions, and tax documents. Statements are
            available the day after each pay run.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="h-3.5 w-3.5" />
          Download all statements
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="YTD earnings"
          value={formatIdr(ytd)}
          detail="Jan – Jul 2026"
          tone="accent"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatTile
          label="Last pay"
          value={formatIdr(last.net)}
          detail={last.period}
          tone="ok"
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatTile
          label="Next pay date"
          value={nextPayDate}
          detail={`${daysToPay} days`}
          tone="info"
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatTile
          label="Statements"
          value={history.length}
          detail="available to download"
          tone="warn"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--muted)" }}
            >
              Latest pay slip
            </div>
            <h2 className="mt-1 text-[16px] font-semibold">{last.period}</h2>
          </div>
          <Badge tone={last.status === "paid" ? "ok" : "warn"}>
            {last.status === "paid" ? "Paid" : "Pending"}
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Gross
            </div>
            <div className="mt-1 font-mono text-[16px] font-semibold tabular-nums">
              {formatIdr(last.gross)}
            </div>
          </div>
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Deductions
            </div>
            <div className="mt-1 space-y-0.5">
              {last.deductions.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between font-mono text-[11.5px] tabular-nums"
                >
                  <span style={{ color: "var(--muted)" }}>{d.label}</span>
                  <span>
                    <ArrowDown
                      className="mr-0.5 inline h-3 w-3"
                      style={{ color: "var(--bad)" }}
                    />
                    {formatIdr(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-xl border p-3"
            style={{
              borderColor: "var(--accent)",
              backgroundColor: "rgba(79,70,229,0.05)",
            }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--accent)" }}
            >
              Net
            </div>
            <div
              className="mt-1 font-mono text-[18px] font-semibold tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {formatIdr(last.net)}
            </div>
          </div>
        </div>
      </div>

      <section
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{
              backgroundColor: "rgba(79,70,229,0.08)",
              color: "var(--accent)",
            }}
          >
            <FileText className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-[14px] font-semibold">Pay history</h2>
        </div>
        <ul className="mt-4 divide-y" style={{ borderColor: "var(--border)" }}>
          {history.map((entry) => (
            <li
              key={entry.period}
              className="flex items-center gap-3 py-3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor:
                    entry.status === "paid"
                      ? "rgba(16,185,129,0.10)"
                      : "rgba(245,158,11,0.10)",
                  color:
                    entry.status === "paid" ? "var(--ok)" : "var(--warn)",
                }}
              >
                {entry.status === "paid" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium">{entry.period}</div>
                <div
                  className="text-[10.5px]"
                  style={{ color: "var(--muted)" }}
                >
                  {entry.status === "paid" ? "Paid" : "Processing"} ·{" "}
                  {entry.deductions.length} deduction
                  {entry.deductions.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12.5px] font-semibold tabular-nums">
                  {formatIdr(entry.net)}
                </div>
                <div
                  className="font-mono text-[10.5px] tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  gross {formatIdr(entry.gross)}
                </div>
              </div>
              <button
                type="button"
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-md border"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                aria-label={`Download ${entry.period}`}
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{
              backgroundColor: "rgba(79,70,229,0.08)",
              color: "var(--accent)",
            }}
          >
            <FileText className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-[14px] font-semibold">Tax documents</h2>
        </div>
        <ul className="mt-4 space-y-2">
          {[
            { label: "Bukti Potong PPh 21 — 2025", size: "86 KB", date: "2026-02-15" },
            { label: "SPT Tahunan 2025", size: "104 KB", date: "2026-03-31" },
            { label: "NPWP card (front)", size: "78 KB", date: "2024-08-12" },
          ].map((d) => (
            <li
              key={d.label}
              className="flex items-center gap-3 rounded-xl border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "rgba(79,70,229,0.08)",
                  color: "var(--accent)",
                }}
              >
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{d.label}</div>
                <div
                  className="text-[10.5px]"
                  style={{ color: "var(--muted)" }}
                >
                  {d.size} · uploaded {d.date}
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="h-3.5 w-3.5" />
                PDF
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

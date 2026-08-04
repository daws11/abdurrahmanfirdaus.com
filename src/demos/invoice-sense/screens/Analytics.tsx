// src/demos/invoice-sense/screens/Analytics.tsx
//
// Summary dashboard. Stat tiles for the week, a vendor breakdown, and a
// confidence distribution. Click a vendor row to filter (interactive).

import { useMemo, useState } from "react";
import {
  Activity,
  CircleDollarSign,
  FileText,
  PercentCircle,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { StatTile } from "@/demos/_shared/StatTile";
import { Button } from "@/demos/_shared/Button";
import {
  INVOICES,
  invoiceTotal,
  fmtCurrency,
  statusLabel,
  statusTone,
} from "../mocks";

interface VendorRollup {
  vendorCode: string;
  vendorName: string;
  count: number;
  total: number;
  mismatches: number;
}

export function Analytics() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const totalValue = useMemo(
    () => INVOICES.reduce((s, i) => s + invoiceTotal(i), 0),
    [],
  );

  const vendorRollups = useMemo<VendorRollup[]>(() => {
    const map = new Map<string, VendorRollup>();
    for (const inv of INVOICES) {
      const r = map.get(inv.vendorCode) ?? {
        vendorCode: inv.vendorCode,
        vendorName: inv.vendor,
        count: 0,
        total: 0,
        mismatches: 0,
      };
      r.count += 1;
      r.total += invoiceTotal(inv);
      if (inv.status === "mismatch") r.mismatches += 1;
      map.set(inv.vendorCode, r);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, []);

  const confidenceBuckets = useMemo(() => {
    const buckets = [
      { label: "90-100%", range: [90, 100] as const, count: 0 },
      { label: "70-89%", range: [70, 89] as const, count: 0 },
      { label: "< 70%", range: [0, 69] as const, count: 0 },
    ];
    for (const inv of INVOICES) {
      const bucket = buckets.find((b) =>
        inv.confidence >= b.range[0] && inv.confidence <= b.range[1],
      );
      if (bucket) bucket.count += 1;
    }
    return buckets;
  }, []);

  const maxVendorTotal = Math.max(...vendorRollups.map((r) => r.total), 1);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header + period toggle */}
      <div
        className="mb-4 flex items-center justify-between rounded-md border p-4"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--fg)" }}
          >
            Weekly finance review
          </h2>
          <p
            className="mt-1 text-[12px]"
            style={{ color: "var(--muted)" }}
          >
            Totals, counts, and confidence distribution across the filtered window.
          </p>
        </div>
        <div className="flex items-center gap-1">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "primary" : "secondary"}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Top stat tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Invoice value"
          value={`USD ${fmtCurrency(totalValue)}`}
          detail={`across ${INVOICES.length} invoices`}
          tone="accent"
          icon={<CircleDollarSign className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Auto-matched"
          value={`${
            Math.round(
              (INVOICES.filter((i) => i.status === "matched").length /
                INVOICES.length) *
                100,
            )
          }%`}
          detail="no human touch"
          tone="ok"
          icon={<PercentCircle className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Invoices"
          value={INVOICES.length}
          detail={`${period} window`}
          tone="info"
          icon={<FileText className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Mismatches"
          value={INVOICES.filter((i) => i.status === "mismatch").length}
          detail="need review"
          tone="bad"
          icon={<Activity className="h-3.5 w-3.5" />}
        />
      </div>

      {/* Vendor breakdown + confidence bars */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section
          className="rounded-md border"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <header
            className="flex items-center gap-2 border-b px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--fg)" }}
            >
              Vendor breakdown
            </h3>
            <span
              className="ml-auto text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              by total value
            </span>
          </header>
          <ul>
            {vendorRollups.map((r) => (
              <li
                key={r.vendorCode}
                className="border-b px-4 py-3 last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[11px] tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {r.vendorCode}
                  </span>
                  <span
                    className="text-[13px] font-medium"
                    style={{ color: "var(--fg)" }}
                  >
                    {r.vendorName}
                  </span>
                  <span
                    className="ml-auto text-[12px] tabular-nums"
                    style={{ color: "var(--fg)" }}
                  >
                    {fmtCurrency(r.total)}
                  </span>
                </div>
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(r.total / maxVendorTotal) * 100}%`,
                      backgroundColor: "var(--accent)",
                    }}
                  />
                </div>
                <div
                  className="mt-1.5 flex items-center gap-2 text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  <span>{r.count} invoices</span>
                  {r.mismatches > 0 && (
                    <Badge tone="bad">{r.mismatches} mismatch</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-md border"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <header
            className="flex items-center gap-2 border-b px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--fg)" }}
            >
              Confidence distribution
            </h3>
            <span
              className="ml-auto text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              OCR confidence
            </span>
          </header>
          <ul>
            {confidenceBuckets.map((b) => (
              <li
                key={b.label}
                className="border-b px-4 py-3 last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: "var(--fg)" }}
                  >
                    {b.label}
                  </span>
                  <span
                    className="ml-auto text-[12px] tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {b.count} invoices
                  </span>
                </div>
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(b.count / INVOICES.length) * 100}%`,
                      backgroundColor:
                        b.range[0] >= 90
                          ? "var(--ok)"
                          : b.range[0] >= 70
                            ? "var(--warn)"
                            : "var(--bad)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div
            className="border-t px-4 py-3 text-[11px]"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            Below 70% triggers a human review before posting.
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section
        className="mt-4 overflow-hidden rounded-md border"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <header
          className="flex items-center gap-2 border-b px-4 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--fg)" }}
          >
            Recent activity
          </h3>
          <span
            className="ml-auto text-[11px]"
            style={{ color: "var(--muted)" }}
          >
            last 7 days
          </span>
        </header>
        <ul>
          {INVOICES.slice(0, 5).map((inv) => (
            <li
              key={inv.id}
              className="flex items-center gap-3 border-b px-4 py-2.5 text-[12px] last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="font-mono tabular-nums"
                style={{ color: "var(--muted)" }}
              >
                {inv.id}
              </span>
              <span style={{ color: "var(--fg)" }}>{inv.vendor}</span>
              <Badge tone={statusTone(inv.status)}>
                {statusLabel(inv.status)}
              </Badge>
              <span
                className="ml-auto tabular-nums"
                style={{ color: "var(--muted)" }}
              >
                {inv.date}
              </span>
              <span
                className="w-24 text-right font-medium tabular-nums"
                style={{ color: "var(--fg)" }}
              >
                {fmtCurrency(invoiceTotal(inv), inv.currency)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
// src/demos/channelflow/screens/CommissionLedger.tsx
//
// Commission ledger — per-tour-guide commission, computed from confirmed
// bookings. Rule: groups of 6+ earn 10% of the booking value; groups under 6
// earn no commission. The screen shows a guide-summary table on top and a
// line-item ledger below, with a "Pay next period" action that resets the
// pending state (component-state-only — no real payments).

import { useMemo, useState } from "react";
import { CircleDollarSign, Users } from "lucide-react";
import {
  COMMISSION_LEDGER,
  GUIDE_TOTALS,
  TOUR_GUIDES,
  type CommissionRow,
} from "../mocks";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Button } from "@/demos/_shared/Button";
import { Badge } from "@/demos/_shared/Badge";
import { cn } from "@/lib/utils";

function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const COMMISSION_RATE = 0.1;
const THRESHOLD = 6;

export function CommissionLedger() {
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [selectedGuide, setSelectedGuide] = useState<string | null>(
    TOUR_GUIDES[0]?.code ?? null,
  );

  const rows = useMemo(
    () =>
      COMMISSION_LEDGER.map((r) => ({
        ...r,
        paid: paidIds.has(r.id),
      })),
    [paidIds],
  );

  const rowsForGuide = useMemo(
    () => (selectedGuide ? rows.filter((r) => r.tourGuideCode === selectedGuide) : []),
    [rows, selectedGuide],
  );

  const totals = useMemo(() => {
    const pending = rows.filter((r) => !r.paid).reduce((s, r) => s + r.commission, 0);
    const paid = rows.filter((r) => r.paid).reduce((s, r) => s + r.commission, 0);
    const guides = GUIDE_TOTALS.filter((g) => g.commission > 0).length;
    return { pending, paid, guides };
  }, [rows]);

  function markPaid(id: string) {
    setPaidIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function payGuide(code: string) {
    const ids = rows.filter((r) => r.tourGuideCode === code && !r.paid).map((r) => r.id);
    setPaidIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  const columns: Column<CommissionRow & { paid: boolean }>[] = [
    {
      key: "id",
      header: "Entry",
      sortBy: (r) => r.id,
      cell: (r) => (
        <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
          {r.id}
        </span>
      ),
    },
    {
      key: "guide",
      header: "Guide",
      sortBy: (r) => r.tourGuideCode,
      cell: (r) => (
        <span className="font-mono text-xs tabular-nums">{r.tourGuideCode}</span>
      ),
    },
    {
      key: "booking",
      header: "Booking",
      sortBy: (r) => r.bookingId,
      cell: (r) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{r.guestName}</span>
          <span className="text-[10px] font-mono tabular-nums" style={{ color: "var(--muted)" }}>
            {r.bookingId}
          </span>
        </div>
      ),
    },
    {
      key: "tourDate",
      header: "Tour date",
      sortBy: (r) => r.tourDate,
      cell: (r) => <span className="tabular-nums">{r.tourDate}</span>,
    },
    {
      key: "partySize",
      header: "Party",
      align: "right",
      sortBy: (r) => r.partySize,
      cell: (r) => (
        <span
          className={cn("tabular-nums", r.partySize >= THRESHOLD && "font-medium")}
          style={r.partySize >= THRESHOLD ? { color: "var(--fg)" } : undefined}
        >
          {r.partySize}
        </span>
      ),
    },
    {
      key: "bookingValue",
      header: "Booking value",
      align: "right",
      sortBy: (r) => r.bookingValue,
      cell: (r) => <span className="tabular-nums">{formatIDR(r.bookingValue)}</span>,
    },
    {
      key: "rate",
      header: "Rate",
      align: "right",
      sortBy: (r) => r.rate,
      cell: (r) => (
        <Badge tone={r.rate > 0 ? "ok" : "neutral"}>
          {Math.round(r.rate * 100)}%
        </Badge>
      ),
    },
    {
      key: "commission",
      header: "Commission",
      align: "right",
      sortBy: (r) => r.commission,
      cell: (r) => (
        <span
          className="tabular-nums font-medium"
          style={{ color: r.commission > 0 ? "var(--ok)" : "var(--muted)" }}
        >
          {r.commission > 0 ? formatIDR(r.commission) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) =>
        r.paid ? (
          <Badge tone="info">paid</Badge>
        ) : (
          <button
            type="button"
            onClick={() => markPaid(r.id)}
            className="rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors hover:bg-[var(--surface)]"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            mark paid
          </button>
        ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <header
        className="flex items-end justify-between gap-3 border-b px-5 pb-3 pt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--accent)" }}
          >
            Commission
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Guide commission ledger</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            10% commission auto-applied to confirmed bookings with{" "}
            {THRESHOLD}+ guests. Smaller groups do not earn commission.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4">
        <StatTile
          label="Pending payout"
          value={formatIDR(totals.pending)}
          detail="across all guides"
          tone="accent"
          icon={<CircleDollarSign className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Paid this period"
          value={formatIDR(totals.paid)}
          detail="since last reset"
          tone="ok"
        />
        <StatTile
          label="Active guides"
          value={totals.guides}
          detail="earned commission"
          tone="info"
          icon={<Users className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Commission rate"
          value={`${Math.round(COMMISSION_RATE * 100)}%`}
          detail={`groups of ${THRESHOLD}+`}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 px-5 pb-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Guides sidebar */}
        <div
          className="overflow-hidden rounded-md border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="border-b px-3 py-2 text-[10px] font-medium uppercase tracking-widest"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Tour guides
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {GUIDE_TOTALS.map((g) => {
              const guide = TOUR_GUIDES.find((t) => t.code === g.tourGuideCode);
              const active = selectedGuide === g.tourGuideCode;
              return (
                <li key={g.tourGuideCode}>
                  <button
                    type="button"
                    onClick={() => setSelectedGuide(g.tourGuideCode)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left"
                    style={{
                      backgroundColor: active ? "var(--bg)" : "transparent",
                    }}
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold"
                      style={{
                        backgroundColor: active ? "var(--accent)" : "var(--bg)",
                        color: active ? "var(--accent-fg)" : "var(--muted)",
                        border: active ? "none" : "1px solid var(--border)",
                      }}
                    >
                      {g.tourGuideCode.slice(3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{guide?.name ?? g.tourGuideCode}</div>
                      <div className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {g.bookings} bookings · {g.guests} guests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Commission
                      </div>
                      <div
                        className="text-xs tabular-nums"
                        style={{ color: g.commission > 0 ? "var(--ok)" : "var(--muted)" }}
                      >
                        {g.commission > 0 ? formatIDR(g.commission) : "—"}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {selectedGuide && rowsForGuide.some((r) => !r.paid) && (
            <div
              className="border-t p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => payGuide(selectedGuide)}
              >
                Pay guide ({formatIDR(rowsForGuide.filter((r) => !r.paid).reduce((s, r) => s + r.commission, 0))})
              </Button>
            </div>
          )}
        </div>

        {/* Ledger table */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {selectedGuide
                ? `Entries for ${selectedGuide} · ${TOUR_GUIDES.find((t) => t.code === selectedGuide)?.name ?? ""}`
                : "All entries"}
            </div>
            <div className="text-[10px]" style={{ color: "var(--muted)" }}>
              {rowsForGuide.length} entries
            </div>
          </div>
          <DataTable
            rows={selectedGuide ? rowsForGuide : rows}
            columns={columns}
            rowKey={(r) => r.id}
            initialSort={{ key: "tourDate", dir: "asc" }}
            emptyTitle="No commission yet"
            emptyDescription="No confirmed bookings for this guide with a party of 6 or more."
          />
        </div>
      </div>
    </div>
  );
}

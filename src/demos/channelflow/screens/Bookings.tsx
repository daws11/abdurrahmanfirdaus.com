// src/demos/channelflow/screens/Bookings.tsx
//
// Bookings list — a sortable, filterable table of confirmed / pending
// bookings derived from the inbox threads. Clicking a row opens a side sheet
// with the booking detail (party size, tour guide, channel source, value).

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  BOOKINGS,
  TOUR_GUIDES,
  channelColor,
  channelLabel,
  type Booking,
  type ChannelKey,
} from "../mocks";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { Sheet } from "@/demos/_shared/Sheet";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  new: "neutral" as const,
  confirmed: "ok" as const,
  cancelled: "bad" as const,
};

const CHANNEL_FILTERS: ("all" | ChannelKey)[] = [
  "all",
  "whatsapp",
  "instagram",
  "email",
  "tiktok",
];

function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function ChannelPill({ channel }: { channel: ChannelKey }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
      style={{
        borderColor: channelColor(channel),
        color: channelColor(channel),
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: channelColor(channel) }}
      />
      {channelLabel(channel)}
    </span>
  );
}

export function Bookings() {
  const [channelFilter, setChannelFilter] = useState<"all" | ChannelKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Booking["status"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      BOOKINGS.filter(
        (b) =>
          (channelFilter === "all" || b.channel === channelFilter) &&
          (statusFilter === "all" || b.status === statusFilter),
      ),
    [channelFilter, statusFilter],
  );

  const openBooking = useMemo(
    () => BOOKINGS.find((b) => b.id === openId) ?? null,
    [openId],
  );

  const totals = useMemo(() => {
    const guests = rows.reduce((s, r) => s + r.partySize, 0);
    const value = rows.reduce((s, r) => s + r.bookingValue, 0);
    return { count: rows.length, guests, value };
  }, [rows]);

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Booking",
      sortBy: (r) => r.id,
      cell: (r) => (
        <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
          {r.id}
        </span>
      ),
    },
    {
      key: "guest",
      header: "Guest",
      sortBy: (r) => r.guestName,
      cell: (r) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
            {r.guestName}
          </span>
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>
            {r.partySize} guests
          </span>
        </div>
      ),
    },
    {
      key: "tourDate",
      header: "Tour date",
      sortBy: (r) => r.tourDate,
      cell: (r) => (
        <span className="tabular-nums text-sm">{r.tourDate || "—"}</span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      sortBy: (r) => r.channel,
      cell: (r) => <ChannelPill channel={r.channel} />,
    },
    {
      key: "guide",
      header: "Guide",
      sortBy: (r) => r.tourGuideCode ?? "",
      cell: (r) =>
        r.tourGuideCode ? (
          <span className="font-mono text-xs tabular-nums" style={{ color: "var(--fg)" }}>
            {r.tourGuideCode}
          </span>
        ) : (
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            —
          </span>
        ),
    },
    {
      key: "partySize",
      header: "Party",
      align: "right",
      sortBy: (r) => r.partySize,
      cell: (r) => (
        <span className="tabular-nums text-sm">{r.partySize}</span>
      ),
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      sortBy: (r) => r.bookingValue,
      cell: (r) => (
        <span className="tabular-nums text-sm">{formatIDR(r.bookingValue)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortBy: (r) => r.status,
      cell: (r) => (
        <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
      ),
    },
    {
      key: "open",
      header: "",
      align: "right",
      cell: () => (
        <ChevronRight
          className="ml-auto h-4 w-4"
          style={{ color: "var(--muted)" }}
        />
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
            Bookings
          </div>
          <h1 className="text-xl font-semibold tracking-tight">All bookings</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Confirmed and pending bookings, with channel and tour-guide
            attribution.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4">
        <StatTile
          label="Bookings"
          value={totals.count}
          detail="after filters"
        />
        <StatTile
          label="Guests"
          value={totals.guests}
          detail="seats held"
          tone="info"
        />
        <StatTile
          label="Booking value"
          value={formatIDR(totals.value)}
          detail="IDR"
          tone="accent"
        />
        <StatTile
          label="Avg. party size"
          value={
            totals.count
              ? (totals.guests / totals.count).toFixed(1)
              : "0"
          }
          detail="across bookings"
        />
      </div>

      <div
        className="flex flex-wrap items-center gap-2 border-b px-5 py-2.5"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Channel
        </span>
        {CHANNEL_FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannelFilter(c)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
            )}
            style={{
              backgroundColor: channelFilter === c ? "var(--surface)" : "transparent",
              borderColor: channelFilter === c ? "var(--accent)" : "var(--border)",
              color: channelFilter === c ? "var(--accent)" : "var(--muted)",
            }}
          >
            {c === "all" ? "All" : channelLabel(c)}
          </button>
        ))}
        <span className="ml-3 text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Status
        </span>
        {(["all", "new", "confirmed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className="inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium"
            style={{
              backgroundColor: statusFilter === s ? "var(--surface)" : "transparent",
              borderColor: statusFilter === s ? "var(--accent)" : "var(--border)",
              color: statusFilter === s ? "var(--accent)" : "var(--muted)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
          onRowClick={(r) => setOpenId(r.id)}
          initialSort={{ key: "tourDate", dir: "asc" }}
          emptyTitle="No bookings match these filters"
          emptyDescription="Loosen the filter or check the inbox for new inquiries."
          emptyAction={
            <Button variant="secondary" size="sm" onClick={() => { setChannelFilter("all"); setStatusFilter("all"); }}>
              Clear filters
            </Button>
          }
        />
      </div>

      <Sheet
        open={!!openBooking}
        onClose={() => setOpenId(null)}
        title={openBooking ? `Booking ${openBooking.id}` : "Booking"}
        width={420}
      >
        {openBooking && (
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Guest
              </div>
              <div className="mt-1 text-base font-semibold">{openBooking.guestName}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Tour date" value={openBooking.tourDate || "—"} />
              <DetailRow label="Party size" value={`${openBooking.partySize} guests`} />
              <DetailRow
                label="Channel"
                value={<ChannelPill channel={openBooking.channel} />}
              />
              <DetailRow
                label="Guide"
                value={
                  openBooking.tourGuideCode ? (
                    <span className="font-mono text-xs">{openBooking.tourGuideCode}</span>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>None</span>
                  )
                }
              />
              <DetailRow
                label="Status"
                value={<Badge tone={STATUS_TONE[openBooking.status]}>{openBooking.status}</Badge>}
              />
              <DetailRow
                label="Booking value"
                value={<span className="tabular-nums">{formatIDR(openBooking.bookingValue)}</span>}
              />
            </div>
            <div
              className="rounded-md border p-3 text-xs"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--muted)" }}
            >
              {openBooking.partySize >= 6 && openBooking.tourGuideCode ? (
                <>
                  Guide commission (10%):{" "}
                  <span style={{ color: "var(--fg)" }}>
                    {formatIDR(Math.round(openBooking.bookingValue * 0.1))}
                  </span>
                </>
              ) : (
                <>No commission — party size below 6 or no guide on the booking.</>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">
                Open in inbox
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setOpenId(null)}>
                Close
              </Button>
            </div>
            {/* Slot for related guides */}
            {openBooking.tourGuideCode && (
              <div
                className="rounded-md border p-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Guide on this booking
                </div>
                <div className="mt-1 text-sm font-medium">
                  {TOUR_GUIDES.find((g) => g.code === openBooking.tourGuideCode)?.name ??
                    openBooking.tourGuideCode}
                </div>
                <div className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {TOUR_GUIDES.find((g) => g.code === openBooking.tourGuideCode)?.joinedAt}
                </div>
              </div>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

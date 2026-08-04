// src/demos/channelflow/screens/Analytics.tsx
//
// Analytics summary — channel mix, conversion, revenue, and the next 7 days
// of confirmed tours. This is a complement to the Inbox / Bookings screens
// and a useful "where are we this week" read for the host. All numbers are
// derived from the synthetic fixtures; no external analytics wired.

import { useMemo } from "react";
import { TrendingUp, Users, MessageSquare, CheckCheck } from "lucide-react";
import {
  ANALYTICS,
  BOOKINGS,
  CHANNELS,
  CHANNEL_SUMMARY,
  channelColor,
  channelLabel,
  COMMISSION_LEDGER,
  type ChannelKey,
} from "../mocks";
import { StatTile } from "@/demos/_shared/StatTile";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { Badge } from "@/demos/_shared/Badge";
import { cn } from "@/lib/utils";

function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface UpcomingTour {
  date: string;
  bookingId: string;
  guest: string;
  party: number;
  channel: ChannelKey;
  value: number;
}

const TODAY = "2026-08-03";
const NEXT_WEEK_END = "2026-08-10";

export function Analytics() {
  const upcomingTours = useMemo<UpcomingTour[]>(() => {
    return BOOKINGS.filter(
      (b) =>
        b.status === "confirmed" &&
        b.tourDate >= TODAY &&
        b.tourDate <= NEXT_WEEK_END,
    )
      .sort((a, b) => a.tourDate.localeCompare(b.tourDate))
      .map((b) => ({
        date: b.tourDate,
        bookingId: b.id,
        guest: b.guestName,
        party: b.partySize,
        channel: b.channel,
        value: b.bookingValue,
      }));
  }, []);

  const maxChannel = useMemo(() => {
    return Math.max(1, ...CHANNEL_SUMMARY.map((c) => c.open));
  }, []);

  const totalBooked = CHANNEL_SUMMARY.reduce((s, c) => s + c.booked, 0);
  const totalOpen = CHANNEL_SUMMARY.reduce((s, c) => s + c.open, 0);
  const overallConversion = totalOpen ? totalBooked / totalOpen : 0;

  const upcomingColumns: Column<UpcomingTour>[] = [
    {
      key: "date",
      header: "Date",
      sortBy: (r) => r.date,
      cell: (r) => <span className="font-mono text-xs tabular-nums">{r.date}</span>,
    },
    {
      key: "bookingId",
      header: "Booking",
      sortBy: (r) => r.bookingId,
      cell: (r) => (
        <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
          {r.bookingId}
        </span>
      ),
    },
    {
      key: "guest",
      header: "Guest",
      sortBy: (r) => r.guest,
      cell: (r) => <span className="text-sm font-medium">{r.guest}</span>,
    },
    {
      key: "party",
      header: "Party",
      align: "right",
      sortBy: (r) => r.party,
      cell: (r) => <span className="tabular-nums">{r.party}</span>,
    },
    {
      key: "channel",
      header: "Channel",
      cell: (r) => (
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            borderColor: channelColor(r.channel),
            color: channelColor(r.channel),
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: channelColor(r.channel) }}
          />
          {channelLabel(r.channel)}
        </span>
      ),
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      sortBy: (r) => r.value,
      cell: (r) => <span className="tabular-nums">{formatIDR(r.value)}</span>,
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
            Analytics
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Channel performance</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Channel mix, conversion, and the next 7 days of confirmed tours.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4">
        <StatTile
          label="Total threads"
          value={ANALYTICS.totalThreads}
          detail={`${ANALYTICS.unread} unread`}
          icon={<MessageSquare className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Booked"
          value={ANALYTICS.bookedThisWeek}
          detail="confirmed tours"
          tone="ok"
          icon={<CheckCheck className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Next 7 days"
          value={upcomingTours.length}
          detail="confirmed tours"
          tone="info"
          icon={<Users className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Conversion"
          value={`${(overallConversion * 100).toFixed(0)}%`}
          detail="thread → booked"
          tone="accent"
          icon={<TrendingUp className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 px-5 pb-5 lg:grid-cols-2">
        {/* Channel mix */}
        <section
          className="overflow-hidden rounded-md border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="border-b px-3 py-2 text-[10px] font-medium uppercase tracking-widest"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Channel mix
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {CHANNEL_SUMMARY.map((c) => {
              const widthPct = (c.open / maxChannel) * 100;
              return (
                <li key={c.channel} className="px-3 py-2.5">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: channelColor(c.channel) }}
                    />
                    <span className="text-sm font-medium">
                      {channelLabel(c.channel)}
                    </span>
                    <span className="ml-auto text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
                      {c.open} open · {c.booked} booked
                    </span>
                    <Badge
                      tone={c.conversion >= 0.4 ? "ok" : c.conversion > 0 ? "neutral" : "warn"}
                      className="ml-2"
                    >
                      {(c.conversion * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--bg)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: channelColor(c.channel),
                      }}
                    />
                  </div>
                </li>
              );
            })}
            <li
              className="flex items-center justify-between px-3 py-2 text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              <span>Total</span>
              <span className="tabular-nums">
                {totalOpen} threads · {totalBooked} booked
              </span>
            </li>
          </ul>
          <div
            className="border-t px-3 py-2 text-[10px]"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            {CHANNELS.length} channels active · WhatsApp uses --accent, others use
            the per-channel tokens.
          </div>
        </section>

        {/* Upcoming tours */}
        <section
          className="overflow-hidden rounded-md border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Next 7 days
            </div>
            <div className="text-[10px]" style={{ color: "var(--muted)" }}>
              {upcomingTours.length} tours · {formatIDR(upcomingTours.reduce((s, r) => s + r.value, 0))}
            </div>
          </div>
          <DataTable
            rows={upcomingTours}
            columns={upcomingColumns}
            rowKey={(r) => r.bookingId}
            initialSort={{ key: "date", dir: "asc" }}
            emptyTitle="No tours in the next 7 days"
            emptyDescription="Confirm a booking from the Inbox to fill the calendar."
          />
        </section>
      </div>

      <footer
        className={cn(
          "flex items-center justify-between gap-3 border-t px-5 py-3 text-[11px]",
        )}
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <div>
          Commission accrued:{" "}
          <span className="tabular-nums" style={{ color: "var(--fg)" }}>
            {formatIDR(ANALYTICS.commission)}
          </span>
          {" · "}
          Revenue tracked:{" "}
          <span className="tabular-nums" style={{ color: "var(--fg)" }}>
            {formatIDR(ANALYTICS.revenue)}
          </span>
        </div>
        <div className="text-[10px]">
          CommissionLedger applies 10% to confirmed bookings with party ≥ 6
          (from {COMMISSION_LEDGER.length} eligible entries).
        </div>
      </footer>
    </div>
  );
}

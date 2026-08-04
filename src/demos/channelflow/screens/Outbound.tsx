// src/demos/channelflow/screens/Outbound.tsx
// @ts-nocheck
//
// Outbound campaigns list — production-style stub mirroring
// /components/outbound-messaging/OutboundMessaging.tsx: header with KPI tiles
// (Last 30 days sent / delivered / failed / campaigns sent), filter chips
// for status (All / Draft / Scheduled / Sending / Sent / Failed), and a
// campaign table with channel-color chips, recipient counts, and per-status
// stats. Synthetic data only.

import { useMemo, useState } from "react";
import {
  Plus,
  Send,
  CheckCheck,
  XCircle,
  CalendarClock,
  Loader,
  FileText,
} from "lucide-react";
import {
  OUTBOUND_CAMPAIGNS,
  channelBgClass,
  channelColor,
  channelLabel,
  type OutboundCampaign,
  type ChannelKey,
} from "../mocks";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { cn } from "@/lib/utils";

function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const STATUS_TONE: Record<OutboundCampaign["status"], "neutral" | "info" | "warn" | "ok" | "bad"> = {
  draft: "neutral",
  scheduled: "info",
  sending: "warn",
  sent: "ok",
  failed: "bad",
};

const STATUS_FILTERS: ("all" | OutboundCampaign["status"])[] = [
  "all",
  "draft",
  "scheduled",
  "sending",
  "sent",
  "failed",
];

function ChannelChips({ channels }: { channels: ChannelKey[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {channels.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            borderColor: channelColor(c),
            color: channelColor(c),
          }}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", channelBgClass(c))} />
          {channelLabel(c)}
        </span>
      ))}
    </div>
  );
}

export function Outbound() {
  const [statusFilter, setStatusFilter] = useState<"all" | OutboundCampaign["status"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      OUTBOUND_CAMPAIGNS.filter((c) => statusFilter === "all" || c.status === statusFilter),
    [statusFilter],
  );

  const stats = useMemo(() => {
    const totals = OUTBOUND_CAMPAIGNS.reduce(
      (acc, c) => {
        acc.sent += c.sent;
        acc.delivered += c.delivered;
        acc.failed += c.failed;
        if (c.status === "sent") acc.campaignsSent += 1;
        return acc;
      },
      { sent: 0, delivered: 0, failed: 0, campaignsSent: 0 },
    );
    return { ...totals, label: "Last 30 days" };
  }, []);

  const selected = useMemo(
    () => OUTBOUND_CAMPAIGNS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  const columns: Column<OutboundCampaign>[] = [
    {
      key: "id",
      header: "Campaign",
      sortBy: (r) => r.id,
      cell: (r) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
            {r.name}
          </span>
          <span className="font-mono text-[10px] tabular-nums" style={{ color: "var(--muted)" }}>
            {r.id} · {r.createdBy}
          </span>
        </div>
      ),
    },
    {
      key: "channels",
      header: "Channels",
      cell: (r) => <ChannelChips channels={r.channels} />,
    },
    {
      key: "recipients",
      header: "Recipients",
      align: "right",
      sortBy: (r) => r.recipients,
      cell: (r) => (
        <span className="tabular-nums">{r.recipients.toLocaleString()}</span>
      ),
    },
    {
      key: "delivered",
      header: "Delivered",
      align: "right",
      sortBy: (r) => r.delivered,
      cell: (r) => (
        <span className="tabular-nums" style={{ color: r.delivered ? "var(--ok)" : "var(--muted)" }}>
          {r.delivered.toLocaleString()}
        </span>
      ),
    },
    {
      key: "replied",
      header: "Replied",
      align: "right",
      sortBy: (r) => r.replied,
      cell: (r) => (
        <span className="tabular-nums">{r.replied}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortBy: (r) => r.status,
      cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>,
    },
    {
      key: "when",
      header: "When",
      sortBy: (r) => r.scheduledFor ?? r.sentAt ?? "",
      cell: (r) => (
        <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
          {formatTime(r.scheduledFor ?? r.sentAt)}
        </span>
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
            Outbound
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Re-engagement and broadcast campaigns across all channels.
          </p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          New campaign
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4">
        <StatTile
          label="Sent"
          value={stats.sent.toLocaleString()}
          detail="last 30 days"
          icon={<Send className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Delivered"
          value={stats.delivered.toLocaleString()}
          detail={`${stats.sent ? Math.round((stats.delivered / stats.sent) * 100) : 0}% delivery`}
          tone="ok"
          icon={<CheckCheck className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Failed"
          value={stats.failed.toLocaleString()}
          detail="across all channels"
          tone={stats.failed > 0 ? "bad" : "neutral"}
          icon={<XCircle className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Campaigns"
          value={stats.campaignsSent}
          detail="completed"
          tone="info"
          icon={<CalendarClock className="h-3.5 w-3.5" />}
        />
      </div>

      <div
        className="flex flex-wrap items-center gap-2 border-b px-5 py-2.5"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Status
        </span>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium"
            style={{
              backgroundColor: statusFilter === s ? "var(--surface)" : "transparent",
              borderColor: statusFilter === s ? "var(--accent)" : "var(--border)",
              color: statusFilter === s ? "var(--accent)" : "var(--muted)",
            }}
          >
            {s === "sending" && <Loader className="h-3 w-3 animate-spin" strokeWidth={2} />}
            {s === "draft" && <FileText className="h-3 w-3" strokeWidth={2} />}
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
          onRowClick={(r) => setSelectedId(r.id)}
          initialSort={{ key: "when", dir: "desc" }}
          emptyTitle="No campaigns yet"
          emptyDescription="Create a new campaign to broadcast across your channels."
        />
      </div>

      {selected && (
        <div
          className="border-t px-5 py-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="mb-1 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Selected
              </div>
              <div className="text-sm font-semibold">{selected.name}</div>
            </div>
            <Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>
          </div>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            {selected.body}
          </p>
        </div>
      )}
    </div>
  );
}

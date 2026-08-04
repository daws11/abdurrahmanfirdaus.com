// src/demos/channelflow/screens/Channels.tsx
// @ts-nocheck
//
// Channel connections — production-style stub mirroring the
// /channels page. Lists connected channels (WhatsApp / Instagram DM /
// Email / TikTok) with health badges (healthy / warning / error), per-
// channel 24h message volume, and connection state (connected / paused /
// disconnected). Mirrors production's ChannelConnections component.

import { useState } from "react";
import { Plug, Plus, MoreHorizontal, Webhook } from "lucide-react";
import {
  CHANNEL_CONNECTIONS,
  channelBgClass,
  channelColor,
  channelLabel,
  type ChannelConnection,
} from "../mocks";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<ChannelConnection["status"], "ok" | "warn" | "bad" | "neutral"> = {
  connected: "ok",
  paused: "warn",
  disconnected: "bad",
  warning: "warn",
};

const HEALTH_DOT: Record<ChannelConnection["health"], string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
};

export function Channels() {
  const [activeTab, setActiveTab] = useState<"channels" | "team">("channels");

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
            Channels
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Connections</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Linked inboxes and the AI's reply surface for each one.
          </p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          Connect channel
        </Button>
      </header>

      <div
        className="flex items-center gap-1 border-b px-5 py-2.5"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("channels")}
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[12px] font-medium"
          style={{
            backgroundColor: activeTab === "channels" ? "var(--surface)" : "transparent",
            color: activeTab === "channels" ? "var(--accent)" : "var(--muted)",
            border: activeTab === "channels" ? "1px solid var(--accent)" : "1px solid transparent",
          }}
        >
          <Plug className="h-3 w-3" strokeWidth={2} />
          Channels
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[12px] font-medium"
          style={{
            backgroundColor: activeTab === "team" ? "var(--surface)" : "transparent",
            color: activeTab === "team" ? "var(--accent)" : "var(--muted)",
            border: activeTab === "team" ? "1px solid var(--accent)" : "1px solid transparent",
          }}
        >
          Team
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 lg:grid-cols-2">
        {CHANNEL_CONNECTIONS.map((c) => (
          <article
            key={c.id}
            className="overflow-hidden rounded-md border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div
              className="flex items-start gap-3 border-b p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white",
                  channelBgClass(c.kind),
                )}
              >
                <Plug className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold" style={{ color: "var(--fg)" }}>
                    {c.displayName}
                  </h3>
                  <span
                    className={cn("h-2 w-2 rounded-full", HEALTH_DOT[c.health])}
                    aria-label={`Health: ${c.health}`}
                  />
                </div>
                <p className="mt-0.5 truncate font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                  {c.identity}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                  <Badge tone="info">{channelLabel(c.kind)}</Badge>
                  {c.pausedReason && (
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--muted)" }}
                    >
                      {c.pausedReason}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Channel actions"
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ color: "var(--muted)" }}
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--border)" }}>
              <KV label="24h msgs" value={c.messagesLast24h.toLocaleString()} />
              <KV label="Channel" value={channelLabel(c.kind)} />
              <KV label="Since" value={c.connectedAt.slice(0, 7)} />
            </div>

            {c.webhookUrl && (
              <div
                className="flex items-center gap-2 border-t px-4 py-2.5"
                style={{ borderColor: "var(--border)" }}
              >
                <Webhook className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--muted)" }} strokeWidth={2} />
                <code
                  className="truncate font-mono text-[10.5px]"
                  style={{ color: "var(--muted)" }}
                >
                  {c.webhookUrl}
                </code>
                <span
                  className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium"
                  style={{ color: channelColor(c.kind) }}
                >
                  copy
                </span>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
        {value}
      </div>
    </div>
  );
}

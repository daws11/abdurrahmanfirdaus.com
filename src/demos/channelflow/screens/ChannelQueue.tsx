// src/demos/channelflow/screens/ChannelQueue.tsx
//
// Inbox (ChannelQueue) — the primary screen of Channelflow. A unified queue
// of inbound conversations across WhatsApp, Instagram DM, Email, and TikTok.
// Each thread row shows a channel-color circular avatar (mimicking the
// production app's channel logo). The user can filter by channel, mark a
// thread as "Interested" / "Awaiting deposit" / "Booked" / "Lost" (state
// change persisted in component state), and open a conversation panel with a
// transcript and a quick-reply composer. Cmd/Ctrl+Enter sends the reply.

import { useMemo, useState } from "react";
import {
  Search,
  Send,
  CheckCheck,
  Bot,
  ChevronDown,
  MapPin,
  Calendar,
  Users,
  Sparkle,
} from "lucide-react";
import {
  CHANNELS,
  THREADS,
  MESSAGES,
  channelLabel,
  channelBgClass,
  type ChannelKey,
  type Thread,
  type ThreadStatus,
  type ChatMessage,
  TOUR_GUIDES,
} from "../mocks";
import { EmptyState } from "@/demos/_shared/EmptyState";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ThreadStatus, string> = {
  new: "New",
  interested: "Interested",
  "awaiting-deposit": "Awaiting deposit",
  booked: "Booked",
  lost: "Lost",
};

// Production-style goal badges (top-right pill in the thread row).
const STATUS_TONE: Record<ThreadStatus, string> = {
  new: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  interested:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  "awaiting-deposit":
    "border-amber-200 bg-amber-50 text-amber-700",
  booked:
    "border-emerald-500 bg-emerald-500 text-white",
  lost: "border-rose-200 bg-rose-50 text-rose-600",
};

const NEXT_STATUS: ThreadStatus[] = [
  "new",
  "interested",
  "awaiting-deposit",
  "booked",
  "lost",
];

// Small monochrome glyph per channel — pure SVG, no brand assets.
function ChannelGlyph({ channel, className }: { channel: ChannelKey; className?: string }) {
  const cls = className ?? "h-3.5 w-3.5";
  switch (channel) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className={cls}>
          <path d="M8 0a8 8 0 0 0-6.86 12.13L0 16l3.97-1.04A8 8 0 1 0 8 0Zm4.4 11.18c-.18.51-1.06.97-1.46 1.03-.37.05-.85.07-1.37-.09-.32-.1-.72-.23-1.24-.45-2.18-.94-3.6-3.14-3.71-3.29-.11-.15-.88-1.18-.88-2.25 0-1.07.56-1.6.76-1.82.2-.22.43-.27.58-.27.14 0 .29 0 .42.01.13 0 .31-.05.49.37.18.42.61 1.45.66 1.55.05.11.09.23.02.37-.07.15-.11.23-.22.36-.11.13-.23.29-.32.39-.11.11-.22.23-.1.45.13.22.56.93 1.21 1.5.83.74 1.53.97 1.75 1.08.22.11.34.09.47-.05.13-.15.54-.63.69-.85.15-.22.29-.18.49-.11.2.07 1.27.6 1.49.71.22.11.36.16.42.25.05.09.05.51-.13 1.02Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls}>
          <rect x="2" y="2" width="12" height="12" rx="3" />
          <circle cx="8" cy="8" r="2.7" />
          <circle cx="11.4" cy="4.6" r="0.6" fill="currentColor" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls}>
          <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
          <path d="M2.5 4.5 8 9l5.5-4.5" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className={cls}>
          <path d="M10.5 1.5h2.2c.2 1.5 1.2 2.6 2.7 2.7v2.2c-1 0-1.9-.2-2.7-.7v4.5a4.3 4.3 0 1 1-4.3-4.3c.3 0 .6 0 .9.1v2.3a2 2 0 1 0 1.2 1.8V1.5Z" />
        </svg>
      );
  }
}

function relativeTime(iso: string): string {
  const now = new Date("2026-08-03T09:00:00Z").getTime();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  if (d < 30) return `${Math.floor(d / 7)}w`;
  return `${Math.floor(d / 30)}mo`;
}

function clockTime(iso: string): string {
  // Production uses 24h HH:MM in mono digits.
  return new Date(iso).toISOString().slice(11, 16);
}

export function ChannelQueue() {
  const [channelFilter, setChannelFilter] = useState<"all" | ChannelKey>("all");
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [openId, setOpenId] = useState<string | null>(THREADS[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [transcript, setTranscript] = useState<Record<string, ChatMessage[]>>(MESSAGES);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((t) => {
      if (channelFilter !== "all" && t.channel !== channelFilter) return false;
      if (q && !t.guestName.toLowerCase().includes(q) && !t.preview.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [threads, channelFilter, search]);

  const openThread = useMemo(
    () => threads.find((t) => t.id === openId) ?? null,
    [threads, openId],
  );

  const channelCounts = useMemo(() => {
    const counts: Record<ChannelKey | "all", number> = {
      all: threads.length,
      whatsapp: 0,
      instagram: 0,
      email: 0,
      tiktok: 0,
    };
    for (const t of threads) counts[t.channel] += 1;
    return counts;
  }, [threads]);

  const folderLabel = useMemo(() => {
    // Mimic the production "All · 50 chats" header.
    return `All · ${threads.length} chats`;
  }, [threads.length]);

  function advanceStatus(id: string) {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = NEXT_STATUS.indexOf(t.status);
        const next = NEXT_STATUS[(idx + 1) % NEXT_STATUS.length];
        return { ...t, status: next };
      }),
    );
  }

  function sendReply() {
    if (!openThread || !draft.trim()) return;
    const body = draft.trim();
    const now = new Date("2026-08-03T09:00:00Z").toISOString();
    setTranscript((prev) => ({
      ...prev,
      [openThread.id]: [
        ...(prev[openThread.id] ?? []),
        { from: "agent", body, at: now },
      ],
    }));
    setDraft("");
    // mark thread as read + advance from new→interested
    setThreads((prev) =>
      prev.map((t) =>
        t.id === openThread.id
          ? { ...t, unread: false, status: t.status === "new" ? "interested" : t.status }
          : t,
      ),
    );
  }

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: "var(--bg)" }}>
      <header
        className="flex items-end justify-between gap-3 border-b px-5 pb-3 pt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--accent)" }}
          >
            Inbox
          </div>
          <h1 className="text-xl font-semibold tracking-tight">All conversations</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {folderLabel} · 4 channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
              backgroundColor: "var(--surface)",
            }}
          >
            v1.0
          </span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Thread list — production-style aside */}
        <aside
          className="flex min-h-0 flex-col border-r"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="flex items-center gap-2 border-b px-3 py-2.5"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              <Search className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} strokeWidth={2.25} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                aria-label="Search conversations"
                className="w-full bg-transparent text-[13px] focus:outline-none"
                style={{ color: "var(--fg)" }}
              />
            </div>
            <button
              type="button"
              aria-label="Filter by date"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border"
              style={{
                borderColor: "var(--border)",
                color: "var(--muted)",
                backgroundColor: "var(--bg)",
              }}
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5 border-b px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <FilterChip
              active={channelFilter === "all"}
              onClick={() => setChannelFilter("all")}
              label="All"
              count={channelCounts.all}
            />
            {CHANNELS.map((c) => (
              <FilterChip
                key={c.key}
                active={channelFilter === c.key}
                onClick={() => setChannelFilter(c.key)}
                label={c.label}
                count={channelCounts[c.key]}
                color={c.color}
              />
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No conversations match"
              description="Try a different channel or search term."
            />
          ) : (
            <ul className="min-h-0 flex-1 divide-y overflow-y-auto" style={{ borderColor: "var(--border)" }}>
              {filtered.map((t) => (
                <ThreadRow
                  key={t.id}
                  thread={t}
                  isOpen={t.id === openId}
                  onSelect={() => {
                    setOpenId(t.id);
                    if (t.unread) {
                      setThreads((prev) =>
                        prev.map((x) => (x.id === t.id ? { ...x, unread: false } : x)),
                      );
                    }
                  }}
                />
              ))}
            </ul>
          )}
        </aside>

        {/* Conversation panel */}
        {openThread ? (
          <ConversationPanel
            thread={openThread}
            messages={transcript[openThread.id] ?? []}
            draft={draft}
            setDraft={setDraft}
            onAdvance={() => advanceStatus(openThread.id)}
            onSend={sendReply}
          />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}
          >
            <EmptyState
              title="Pick a conversation to start"
              description="Select a thread on the left to view messages and reply."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ThreadRow({
  thread,
  isOpen,
  onSelect,
}: {
  thread: Thread;
  isOpen: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isOpen ? "true" : undefined}
        className={cn(
          "group relative flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors",
        )}
        style={{
          backgroundColor: isOpen ? "rgba(16,185,129,0.06)" : "transparent",
        }}
      >
        {isOpen && (
          <span
            aria-hidden
            className="absolute inset-y-2 left-0 w-1 rounded-r"
            style={{ backgroundColor: "var(--accent)" }}
          />
        )}

        {/* Channel avatar — production uses circular channel-color tile with white icon. */}
        <div className="relative shrink-0">
          <span
            aria-label={channelLabel(thread.channel)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-white",
              channelBgClass(thread.channel),
            )}
          >
            <ChannelGlyph channel={thread.channel} className="h-4 w-4" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "truncate text-[13px]",
                thread.unread ? "font-semibold" : "font-medium",
              )}
              style={{ color: "var(--fg)" }}
            >
              {thread.guestName}
            </span>
            <span
              className={cn(
                "shrink-0 font-mono text-[10px] tabular-nums",
                thread.unread ? "font-semibold" : "",
              )}
              style={{ color: thread.unread ? "var(--accent)" : "var(--muted)" }}
            >
              {relativeTime(thread.lastAt)}
            </span>
          </div>

          {thread.destination ? (
            <div className="mt-0.5 flex items-center gap-1 text-[10.5px]" style={{ color: "var(--muted)" }}>
              <MapPin className="h-2.5 w-2.5" strokeWidth={2.25} />
              <span className="truncate">
                {thread.destination}
                {thread.tourDate ? ` · ${thread.tourDate.slice(5)}` : ""}
                {thread.slot ? ` · ${thread.slot}` : ""}
              </span>
            </div>
          ) : null}

          <p
            className="mt-0.5 line-clamp-2 text-[12px] leading-snug"
            style={{ color: thread.unread ? "var(--fg)" : "var(--muted)" }}
          >
            {thread.preview}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                STATUS_TONE[thread.status],
              )}
            >
              {STATUS_LABEL[thread.status]}
            </span>
            {thread.partySize ? (
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                · {thread.partySize} guests
              </span>
            ) : null}
          </div>
        </div>

        {thread.unread ? (
          <span
            className="ml-1 mt-1 inline-flex h-4 min-w-[1rem] shrink-0 items-center justify-center rounded-full px-1 font-mono text-[9px] font-semibold"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            1
          </span>
        ) : null}
      </button>
    </li>
  );
}

function ConversationPanel({
  thread,
  messages,
  draft,
  setDraft,
  onAdvance,
  onSend,
}: {
  thread: Thread;
  messages: ChatMessage[];
  draft: string;
  setDraft: (v: string) => void;
  onAdvance: () => void;
  onSend: () => void;
}) {
  const guide = thread.tourGuideCode
    ? TOUR_GUIDES.find((g) => g.code === thread.tourGuideCode)
    : null;
  return (
    <div className="flex min-h-0 flex-col" style={{ backgroundColor: "var(--bg)" }}>
      <header
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="relative shrink-0">
          <span
            aria-label={channelLabel(thread.channel)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-white",
              channelBgClass(thread.channel),
            )}
          >
            <ChannelGlyph channel={thread.channel} className="h-4.5 w-4.5" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="min-w-0 truncate text-[15px] font-semibold" style={{ color: "var(--fg)" }}>
              {thread.guestName}
            </h2>
            <span
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              · {channelLabel(thread.channel)}
            </span>
            {thread.status === "lost" ? (
              <span
                className="inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                  backgroundColor: "var(--surface)",
                }}
              >
                Closed
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
            {thread.partySize ? (
              <span className="inline-flex items-center gap-0.5">
                <Users className="h-3 w-3" strokeWidth={2.25} /> {thread.partySize} guests
              </span>
            ) : null}
            {thread.tourDate ? (
              <span className="inline-flex items-center gap-0.5">
                <Calendar className="h-3 w-3" strokeWidth={2.25} /> {thread.tourDate}
                {thread.slot ? ` · ${thread.slot}` : ""}
              </span>
            ) : null}
            {thread.destination ? (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" strokeWidth={2.25} /> {thread.destination}
              </span>
            ) : null}
            {guide ? (
              <span className="inline-flex items-center gap-0.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                  {guide.code}
                </span>
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          aria-label="AI assistant"
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold transition"
          style={{
            borderColor: "#c4b5fd",
            backgroundColor: "#f5f3ff",
            color: "#6d28d9",
          }}
        >
          <Bot className="h-3.5 w-3.5" strokeWidth={2.25} />
          AI on
        </button>
        <button
          type="button"
          onClick={onAdvance}
          className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
          style={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            backgroundColor: "var(--surface)",
          }}
        >
          <CheckCheck className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
          Advance
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          {messages.length === 0 ? (
            <div
              className="rounded-md border border-dashed py-10 text-center text-xs"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              No messages yet — start the chat with a quick reply.
            </div>
          ) : (
            messages.map((m, i) => <MessageBubble key={i} message={m} />)
          )}
        </div>
      </div>

      <div
        className="border-t px-4 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div
          className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          <Sparkle className="h-3 w-3" style={{ color: "var(--accent)" }} strokeWidth={2.25} />
          Quick reply
        </div>
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Type a reply…"
            className="min-h-9 flex-1 resize-none rounded-md border px-3 py-1.5 text-sm focus:outline-none"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--fg)",
            }}
          />
          <button
            type="button"
            onClick={onSend}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold shadow-sm"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-fg)",
            }}
          >
            <Send className="h-3.5 w-3.5" />
            Send
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px]" style={{ color: "var(--muted)" }}>
          <span>
            <kbd
              className="rounded border px-1 font-mono"
              style={{ borderColor: "var(--border)" }}
            >
              ⌘
            </kbd>
            <span className="mx-0.5">+</span>
            <kbd
              className="rounded border px-1 font-mono"
              style={{ borderColor: "var(--border)" }}
            >
              Enter
            </kbd>{" "}
            to send
          </span>
          <span>Reply will be sent as the team</span>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  count,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] font-medium transition-colors"
      style={{
        backgroundColor: active ? "var(--surface)" : "transparent",
        borderColor: active ? "var(--accent)" : "var(--border)",
        color: active ? "var(--accent)" : "var(--muted)",
      }}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
      <span className="tabular-nums text-[10px] opacity-70">{count}</span>
    </button>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isGuest = message.from === "guest";
  return (
    <div className={cn("flex min-w-0 gap-2", isGuest ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[78%] flex-col gap-0.5", isGuest ? "items-start" : "items-end")}>
        <div
          className={cn(
            "whitespace-pre-wrap rounded-2xl border px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-sm",
            isGuest
              ? "rounded-bl-md"
              : "rounded-br-md border-transparent",
          )}
          style={
            isGuest
              ? {
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--fg)",
                }
              : {
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-fg)",
                }
          }
        >
          {message.body}
        </div>
        <span
          className="mx-1 font-mono text-[10px] tabular-nums"
          style={{ color: "var(--muted)" }}
        >
          {clockTime(message.at)}
        </span>
      </div>
    </div>
  );
}

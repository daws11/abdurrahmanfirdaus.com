// src/demos/taxai-chat/screens/Inbox.tsx
//
// Conversation list — sidebar-style with topic chip, unread badge, and a
// token usage footer. Clicking a row navigates to /conversation.

import { Search, MessageSquare } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { setDemoHash } from "@/demos/router";
import { CONVERSATIONS, TOKEN_QUOTA } from "../mocks";

const TOPIC_TONE = {
  VAT: "ok",
  "Corporate Tax": "accent",
  "Free Zones": "neutral",
  Excise: "warn",
  "Transfer Pricing": "neutral",
} as const;

export function Inbox() {
  const pct = Math.round((TOKEN_QUOTA.used / TOKEN_QUOTA.limit) * 100);

  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <aside className="flex h-full flex-col border-r" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="border-b p-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm" style={{ borderColor: "var(--border)" }}>
            <Search className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
            <input
              className="flex-1 bg-transparent outline-none"
              placeholder="Search conversations..."
              style={{ color: "var(--fg)" }}
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setDemoHash("taxai-chat", "conversation")}
                className="flex w-full flex-col gap-1 border-b px-3 py-2.5 text-left hover:bg-white"
                style={{ borderColor: "var(--border)", backgroundColor: c.unread ? "white" : undefined }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{c.title}</span>
                  {c.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />}
                </div>
                <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{c.preview}</p>
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <Badge tone={TOPIC_TONE[c.topic]}>{c.topic}</Badge>
                  <span style={{ color: "var(--muted)" }}>{c.updatedAt}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-baseline justify-between text-xs">
            <span style={{ color: "var(--muted)" }}>Tokens this month</span>
            <span className="font-medium">{TOKEN_QUOTA.used.toLocaleString()} / {TOKEN_QUOTA.limit.toLocaleString()}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--border)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }} />
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center" style={{ color: "var(--muted)" }}>
        <div className="text-center">
          <MessageSquare className="mx-auto h-8 w-8" />
          <p className="mt-3 text-sm">Select a conversation to continue.</p>
        </div>
      </main>
    </div>
  );
}

// src/demos/taxai-chat/screens/Inbox.tsx
//
// Conversation list sidebar with search, online dots, profile mini in the
// header, and a token usage footer. Click a row → /conversation. Main
// column shows QuickStart prompts when nothing is selected.

import { Search, MessageSquare, Plus, FileText, Calculator, Globe2, ChevronDown } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { setDemoHash } from "@/demos/router";
import { CONVERSATIONS, TOKEN_QUOTA, SAMPLE_USER, initials } from "../mocks";

const TOPIC_TONE = {
  VAT: "ok",
  "Corporate Tax": "accent",
  "Free Zones": "neutral",
  Excise: "warn",
  "Transfer Pricing": "neutral",
} as const;

const QUICKSTARTS = [
  {
    icon: Calculator,
    title: "Calculate VAT on an invoice",
    body: "Quickly check the VAT component of any invoice amount in AED.",
  },
  {
    icon: FileText,
    title: "Summarize a tax document",
    body: "Upload a PDF and get a plain-English summary with citations.",
  },
  {
    icon: Globe2,
    title: "Explain free-zone tax treatment",
    body: "Walk through whether a free-zone entity qualifies for 0% corporate tax.",
  },
];

export function Inbox() {
  const pct = Math.round((TOKEN_QUOTA.used / TOKEN_QUOTA.limit) * 100);

  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <aside
        className="flex h-full flex-col border-r"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        {/* Profile mini + new chat */}
        <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: "var(--border)" }}>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{SAMPLE_USER.name}</p>
            <p className="truncate text-[10px]" style={{ color: "var(--muted)" }}>
              {SAMPLE_USER.email}
            </p>
          </div>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md hover:opacity-80"
            style={{ color: "var(--muted)" }}
            aria-label="Profile menu"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b p-3" style={{ borderColor: "var(--border)" }}>
          <div
            className="flex items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <Search className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
            <input
              className="flex-1 bg-transparent outline-none"
              placeholder="Search conversations..."
              style={{ color: "var(--fg)" }}
            />
          </div>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            <Plus className="h-3.5 w-3.5" /> New chat
          </button>
        </div>

        {/* Conversation list */}
        <ul className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setDemoHash("taxai-chat", "conversation")}
                className="flex w-full flex-col gap-1 border-b px-3 py-2.5 text-left hover:bg-white"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: c.unread ? "white" : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    {c.online && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--ok)" }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="truncate text-sm font-medium">{c.title}</span>
                  </div>
                  {c.unread && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </div>
                <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
                  {c.preview}
                </p>
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <Badge tone={TOPIC_TONE[c.topic]}>{c.topic}</Badge>
                  <span style={{ color: "var(--muted)" }}>{c.updatedAt}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Token usage */}
        <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-baseline justify-between text-xs">
            <span style={{ color: "var(--muted)" }}>Tokens this month</span>
            <span className="font-medium">
              {TOKEN_QUOTA.used.toLocaleString()} / {TOKEN_QUOTA.limit.toLocaleString()}
            </span>
          </div>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6" style={{ color: "var(--muted)" }}>
        <div className="max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <MessageSquare className="h-8 w-8" />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--fg)" }}>
              How can I help with UAE tax today?
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Pick a starter prompt or type your own question.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {QUICKSTARTS.map((q) => (
              <button
                key={q.title}
                type="button"
                className="group flex flex-col items-start gap-2 rounded-md border p-4 text-left transition hover:shadow-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <q.icon className="h-4 w-4" style={{ color: "var(--accent)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
                  {q.title}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {q.body}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

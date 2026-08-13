// src/demos/taxai-chat/screens/Conversation.tsx
//
// Conversation view — dual bubble (user/assistant) with per-message avatars,
// typing indicator dots after the last user message, and hover-reveal
// reaction chips below each AI bubble. Composer with paperclip + send.

import { useState } from "react";
import { Paperclip, Send, FileText, ExternalLink, ChevronLeft, ThumbsUp, Heart, Copy } from "lucide-react";
import { setDemoHash } from "@/demos/router";
import { SAMPLE_MESSAGES } from "../mocks";

import { initials } from "../mocks";

const AI_INITIALS = "AI";

const REACTIONS = [
  { icon: ThumbsUp, label: "Helpful" },
  { icon: Heart, label: "Love it" },
  { icon: Copy, label: "Copy" },
];

export function Conversation() {
  const [draft, setDraft] = useState("");
  const lastUserIndex = SAMPLE_MESSAGES.map((m) => m.role).lastIndexOf("user");
  // ponytail: typing indicator shown only after the most recent user message
  // (mimics "AI is replying" cue). Disabled after AI replies, re-enabled on
  // every new user message — for the demo, show it once at the end.
  const showTyping = lastUserIndex === SAMPLE_MESSAGES.length - 1;

  return (
    <div className="flex h-full flex-col">
      <header
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <button
          onClick={() => setDemoHash("taxai-chat", "inbox")}
          className="hover:opacity-80"
          style={{ color: "var(--muted)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold">VAT rate on restaurant food</p>
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>
            VAT · 8 messages · GPT-4o · today
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {SAMPLE_MESSAGES.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex items-start justify-end gap-2">
              <div
                className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                {m.content}
                <div className="mt-1 text-[10px] opacity-70">{m.timestamp}</div>
              </div>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                {initials}
              </div>
            </div>
          ) : (
            <div key={m.id} className="group flex items-start gap-2">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                }}
              >
                {AI_INITIALS}
              </div>
              <div className="flex max-w-[80%] flex-col gap-1.5">
                <div
                  className="rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.attachmentName && (
                    <div
                      className="mt-2 inline-flex items-center gap-2 rounded-md border bg-white px-2 py-1 text-xs"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <FileText className="h-3 w-3" style={{ color: "var(--accent)" }} />
                      {m.attachmentName}
                    </div>
                  )}

                  {m.citations && (
                    <div className="mt-3 space-y-1.5">
                      {m.citations.map((c) => (
                        <div
                          key={c.source}
                          className="rounded-md border bg-white px-2.5 py-1.5 text-xs"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <p className="flex items-center gap-1 font-medium" style={{ color: "var(--accent)" }}>
                            <ExternalLink className="h-3 w-3" /> {c.source}
                          </p>
                          <p className="mt-0.5" style={{ color: "var(--muted)" }}>
                            "{c.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>
                    {m.timestamp}
                  </div>
                </div>

                {/* Reactions row — hover-reveal, kept reachable by keyboard */}
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {REACTIONS.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      aria-label={r.label}
                      className="flex h-6 items-center gap-1 rounded-full border px-2 text-[10px] transition hover:opacity-80"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--surface)",
                        color: "var(--muted)",
                      }}
                    >
                      <r.icon className="h-3 w-3" />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ),
        )}

        {showTyping && (
          <div className="flex items-start gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              {AI_INITIALS}
            </div>
            <div
              className="flex items-center gap-1 rounded-2xl rounded-tl-sm border px-4 py-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ backgroundColor: "var(--muted)", animationDelay: "0ms" }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ backgroundColor: "var(--muted)", animationDelay: "150ms" }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ backgroundColor: "var(--muted)", animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      <footer
        className="border-t bg-white px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex items-end gap-2 rounded-lg border px-3 py-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <button className="hover:opacity-80" style={{ color: "var(--muted)" }} aria-label="Attach file">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about UAE tax..."
            className="flex-1 resize-none bg-transparent text-sm outline-none"
            rows={1}
          />
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            disabled={!draft.trim()}
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

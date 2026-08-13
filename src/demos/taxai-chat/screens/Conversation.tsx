// src/demos/taxai-chat/screens/Conversation.tsx
//
// Conversation view — dual bubble (user/assistant), citation cards under AI
// messages, attachment chips, and a composer with paperclip + send button.

import { useState } from "react";
import { Paperclip, Send, FileText, ExternalLink, ChevronLeft } from "lucide-react";
import { setDemoHash } from "@/demos/router";
import { SAMPLE_MESSAGES } from "../mocks";

export function Conversation() {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <button onClick={() => setDemoHash("taxai-chat", "inbox")} className="hover:opacity-80" style={{ color: "var(--muted)" }}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold">VAT rate on restaurant food</p>
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>VAT · 8 messages · GPT-4o · today</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {SAMPLE_MESSAGES.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm" style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
                {m.content}
                <div className="mt-1 text-[10px] opacity-70">{m.timestamp}</div>
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex flex-col items-start gap-2">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                <p className="whitespace-pre-wrap">{m.content}</p>

                {m.attachmentName && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-md border bg-white px-2 py-1 text-xs" style={{ borderColor: "var(--border)" }}>
                    <FileText className="h-3 w-3" style={{ color: "var(--accent)" }} /> {m.attachmentName}
                  </div>
                )}

                {m.citations && (
                  <div className="mt-3 space-y-1.5">
                    {m.citations.map((c) => (
                      <div key={c.source} className="rounded-md border bg-white px-2.5 py-1.5 text-xs" style={{ borderColor: "var(--border)" }}>
                        <p className="flex items-center gap-1 font-medium" style={{ color: "var(--accent)" }}>
                          <ExternalLink className="h-3 w-3" /> {c.source}
                        </p>
                        <p className="mt-0.5" style={{ color: "var(--muted)" }}>"{c.snippet}"</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>{m.timestamp}</div>
              </div>
            </div>
          ),
        )}
      </div>

      <footer className="border-t bg-white px-4 py-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-end gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
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

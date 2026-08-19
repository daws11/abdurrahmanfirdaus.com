// src/demos/taxai-chat/screens/Conversation.tsx
//
// Conversation view — header with back button + chat list using ChatBubble.
// Avatar circles per message, typing indicator, citations under assistant
// bubbles, paperclip + send composer.
//
// E.4: composer actually sends. handleSend appends the user message, kicks
// the typing indicator, and after a 900ms delay appends a topic-aware canned
// reply from CANNED_REPLIES. Cmd/Ctrl+Enter submits.
//
// E.6 will lift `messages` into a per-conversation map; this E.4 establishes
// the state machine and seed data.

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, FileText, ExternalLink, ChevronLeft } from "lucide-react";
import { setDemoHash } from "@/demos/router";
import { ChatBubble } from "./ChatBubble";
import { SAMPLE_MESSAGES, SAMPLE_USER, CONVERSATIONS, CANNED_REPLIES } from "../mocks";

const AI_INITIALS = "AI";
const TYPING_DELAY_MS = 900;

const USER_INITIALS = SAMPLE_USER.name
  .split(" ")
  .map((p) => p.charAt(0))
  .join("")
  .slice(0, 2)
  .toUpperCase();

function Avatar({ accent }: { accent: boolean }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
      style={{
        backgroundColor: accent ? "var(--accent)" : "color-mix(in srgb, var(--accent) 15%, transparent)",
        color: accent ? "var(--accent-fg)" : "var(--accent)",
      }}
    >
      {accent ? USER_INITIALS : AI_INITIALS}
    </div>
  );
}

interface ConversationProps {
  /** Active session id (E.6 will thread this through). Currently unused but
   *  accepted so the caller wiring in E.6 doesn't need to change. */
  sessionId?: string;
}

export function Conversation({ sessionId: _sessionId }: ConversationProps = {}) {
  // E.4: messages in local state; E.6 will swap initial value to read from
  // MESSAGES_BY_CONVERSATION[id].
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing indicator toggles.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // The active conversation's topic drives canned-reply selection. E.6 will
  // derive this from sessionId; for now we hardcode c-001 (VAT) which is the
  // only conversation with real messages in SAMPLE_MESSAGES.
  const activeTopic = "VAT" as const;
  const sessionTitle = CONVERSATIONS.find((c) => c.id === "c-001")?.title ?? "Conversation";

  const handleSend = () => {
    const text = draft.trim();
    if (!text || isTyping) return;
    const userMsg = {
      id: `m-${Date.now()}`,
      conversationId: "c-001",
      role: "user" as const,
      content: text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setIsTyping(true);

    // After TYPING_DELAY_MS, append a canned reply picked by current topic.
    setTimeout(() => {
      const pool = CANNED_REPLIES[activeTopic];
      const reply = pool[Math.floor(Math.random() * pool.length)];
      const aiMsg = {
        id: `m-${Date.now() + 1}`,
        conversationId: "c-001",
        role: "assistant" as const,
        content: reply,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, TYPING_DELAY_MS);
  };

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
          <p className="text-sm font-semibold">{sessionTitle}</p>
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>
            {activeTopic} · {messages.length} messages · GPT-4o · today
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && <Avatar accent={false} />}
            <div className="flex flex-col gap-2 max-w-[80%]">
              <ChatBubble
                role={m.role}
                content={m.content}
                timestamp={m.timestamp}
              >
                {m.attachmentName && (
                  <div
                    className={`inline-flex items-center gap-2 rounded-md border bg-white px-2 py-1 text-xs mb-1.5 ${
                      m.role === "user" ? "self-end" : "self-start"
                    }`}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <FileText className="h-3 w-3" style={{ color: "var(--accent)" }} />
                    {m.attachmentName}
                  </div>
                )}
              </ChatBubble>
              {m.citations && (
                <div className="space-y-1.5">
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
            </div>
            {m.role === "user" && <Avatar accent={true} />}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2">
            <Avatar accent={false} />
            <div
              className="flex items-center gap-1 rounded-lg px-4 py-3"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: "var(--muted)", animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: "var(--muted)", animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: "var(--muted)", animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <footer
        className="border-t px-4 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
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
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Atto anything..."
            className="flex-1 resize-none bg-transparent text-sm outline-none"
            rows={1}
          />
          <button
            type="button"
            onClick={handleSend}
            className="flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            disabled={!draft.trim() || isTyping}
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

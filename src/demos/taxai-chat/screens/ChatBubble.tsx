// src/demos/taxai-chat/screens/ChatBubble.tsx
//
// Dual bubble with hover-reveal action tray. Plain text content — no inline
// markdown parsing. Matches production ChatMessage layout (ui/chat-message.tsx).

import type { ReactNode } from "react";
import { ThumbsUp, Heart, Copy } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  children?: ReactNode;
}

// ponytail: no inline parser — assistant copy is authored plain text
// (see mocks.ts). Production uses MarkdownRenderer, but the demo's author
// controls the strings directly, so no parser layer is needed here.
export function ChatBubble({ role, content, timestamp, children }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      {children}

      <div
        className="group/message relative max-w-[75%] rounded-lg px-4 py-2.5 text-sm"
        style={{
          backgroundColor: isUser ? "var(--accent)" : "var(--surface)",
          color: isUser ? "var(--accent-fg)" : "var(--fg)",
          border: isUser ? "none" : "1px solid var(--border)",
        }}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>

        {/* Hover-reveal action tray (assistant only) */}
        {!isUser && (
          <div
            className="absolute -bottom-3 right-2 flex space-x-1 rounded-md border p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
          >
            <button
              type="button"
              className="rounded p-1 hover:opacity-80"
              style={{ color: "var(--muted)" }}
              aria-label="Helpful"
            >
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="rounded p-1 hover:opacity-80"
              style={{ color: "var(--muted)" }}
              aria-label="Love it"
            >
              <Heart className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="rounded p-1 hover:opacity-80"
              style={{ color: "var(--muted)" }}
              aria-label="Copy"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {timestamp && (
        <span className="mt-1 px-1 text-[10px] opacity-70" style={{ color: "var(--muted)" }}>
          {timestamp}
        </span>
      )}
    </div>
  );
}

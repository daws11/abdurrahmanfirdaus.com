# Sub-project C — TaxAI Chat 99% Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the TaxAI Chat portfolio demo to 99% match production `chat.taxai`: production-style AppSidebar (Atto branding + new chat + session list with hover-delete + Globe language dropdown + token progress + user info), production-style ChatMessage (dual bubble + markdown parsing + hover-reveal actions + attachments), production-style LanguageSwitcher dropdown + compact Subscription card in Settings.

**Architecture:** Decompose Inbox/Conversation/Settings into 5 new shared sub-components (`SidebarHeader`, `LanguageDropdown`, `SessionRow`, `SidebarFooter`, `ChatBubble`) extracted to `screens/` (intra-demo reuse). Mini markdown parser for `**bold**` + `*italic*` (no full markdown library). Brand identity shifts to "Atto" (production's actual AI assistant name).

**Tech Stack:** Vite + React 19 + TypeScript, Tailwind v4, lucide-react, shadcn new-york primitives (`Shell`, `Field`, `Button`, `Badge`, `StatTile`), theme tokens (`var(--accent)`, `var(--surface)`, `var(--border)`, `var(--muted)`, `var(--fg)`, `var(--ok)`, `var(--bad)`).

---

## File Structure

### Files to create

- `src/demos/taxai-chat/screens/SidebarHeader.tsx` — Atto branding + chevron.
- `src/demos/taxai-chat/screens/LanguageDropdown.tsx` — Globe icon + EN/AR dropdown.
- `src/demos/taxai-chat/screens/SessionRow.tsx` — single conversation row with hover-delete.
- `src/demos/taxai-chat/screens/SidebarFooter.tsx` — composes LanguageDropdown + token + user + Settings/Signout.
- `src/demos/taxai-chat/screens/ChatBubble.tsx` — dual-bubble with markdown parsing + hover actions.

### Files to modify

- `src/demos/taxai-chat/mocks.ts` — extend `CONVERSATIONS`, add `SESSION_HISTORY`, `USER_META`, `LANGUAGES`.
- `src/demos/taxai-chat/screens/Inbox.tsx` — rewrite to production AppSidebar layout.
- `src/demos/taxai-chat/screens/Conversation.tsx` — use `ChatBubble`.
- `src/demos/taxai-chat/screens/Settings.tsx` — use `LanguageDropdown` + compact Subscription card.

### Files NOT changed

- `src/demos/taxai-chat/routes.tsx` (still inbox | conversation | settings).
- `src/demos/taxai-chat/index.tsx`.
- Vite config (manual chunk for taxai-chat already in place from iteration 2).

---

## Task 1: Foundation — mocks extension + SidebarHeader + LanguageDropdown

**Files:**
- Modify: `src/demos/taxai-chat/mocks.ts`
- Create: `src/demos/taxai-chat/screens/SidebarHeader.tsx`
- Create: `src/demos/taxai-chat/screens/LanguageDropdown.tsx`

- [ ] **Step 1: Extend `mocks.ts` with SESSION_HISTORY, USER_META, LANGUAGES**

Read current `src/demos/taxai-chat/mocks.ts` first. Append these exports at the end:

```ts
// SESSION_HISTORY — past chat sessions for the sidebar list (synthetic)
export interface SessionHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export const SESSION_HISTORY: SessionHistoryItem[] = [
  { id: "s-1", title: "VAT rate on restaurant food", updatedAt: "2026-08-13", messageCount: 8 },
  { id: "s-2", title: "Corporate tax registration threshold", updatedAt: "2026-08-12", messageCount: 14 },
  { id: "s-3", title: "Free zone qualifying income", updatedAt: "2026-08-11", messageCount: 22 },
  { id: "s-4", title: "Excise tax on soft drinks", updatedAt: "2026-08-10", messageCount: 6 },
  { id: "s-5", title: "Transfer pricing documentation", updatedAt: "2026-08-08", messageCount: 19 },
  { id: "s-6", title: "VAT on imported services", updatedAt: "2026-08-05", messageCount: 11 },
];

// USER_META — sidebar footer user info (already covers SAMPLE_USER; keep separate for clarity)
export const USER_META = {
  initials: SAMPLE_USER.name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  name: SAMPLE_USER.name,
  email: SAMPLE_USER.email,
};

// LANGUAGES — language dropdown options (matches production's EN/AR)
export interface Language {
  code: "en" | "ar";
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];
```

- [ ] **Step 2: Create `SidebarHeader.tsx`**

Create `src/demos/taxai-chat/screens/SidebarHeader.tsx`:

```tsx
// src/demos/taxai-chat/screens/SidebarHeader.tsx
//
// Sidebar header — Atto branding + collapse chevron. Matches production
// AppSidebar header (app-sidebar.tsx:125-130).

import { Sparkles, ChevronLeft } from "lucide-react";

export function SidebarHeader({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5" style={{ color: "var(--accent)" }} />
        {!collapsed && (
          <span className="font-semibold text-sm" style={{ color: "var(--fg)" }}>
            Talk with Atto
          </span>
        )}
      </div>
      {!collapsed && (
        <button
          className="hover:opacity-80"
          style={{ color: "var(--muted)" }}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `LanguageDropdown.tsx`**

Create `src/demos/taxai-chat/screens/LanguageDropdown.tsx`:

```tsx
// src/demos/taxai-chat/screens/LanguageDropdown.tsx
//
// Globe icon dropdown — EN/AR language picker. Matches production
// LanguageSwitcher (language-switcher.tsx).

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { LANGUAGES } from "../mocks";
import { cn } from "@/lib/utils";

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"en" | "ar">("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === active)!;

  return (
    <div ref={ref} className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center justify-between w-full h-9 rounded-md px-2.5 text-xs",
          "hover:opacity-80",
        )}
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--fg)",
        }}
        aria-label="Select language"
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4" style={{ color: "var(--muted)" }} />
          {current.nativeName}
        </span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-md shadow-lg z-50 overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === active;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setActive(lang.code);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:opacity-80"
                style={{
                  backgroundColor: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "var(--accent-fg)" : "var(--fg)",
                }}
                aria-pressed={isActive}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-[10px] opacity-75">{lang.name}</span>
                </div>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "currentColor" }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: clean (no errors yet — new files are self-contained, index.tsx not updated yet).

- [ ] **Step 5: Commit**

```bash
git add src/demos/taxai-chat/mocks.ts src/demos/taxai-chat/screens/SidebarHeader.tsx src/demos/taxai-chat/screens/LanguageDropdown.tsx
git commit -m "feat(taxai-chat): foundation — mocks extension, SidebarHeader, LanguageDropdown"
```

---

## Task 2: SessionRow + SidebarFooter

**Files:**
- Create: `src/demos/taxai-chat/screens/SessionRow.tsx`
- Create: `src/demos/taxai-chat/screens/SidebarFooter.tsx`

- [ ] **Step 1: Create `SessionRow.tsx`**

Create `src/demos/taxai-chat/screens/SessionRow.tsx`:

```tsx
// src/demos/taxai-chat/screens/SessionRow.tsx
//
// Single conversation row in the sidebar. Hover-reveal Trash delete action.
// Matches production AppSidebar session list (app-sidebar.tsx:149-191).

import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import type { SessionHistoryItem } from "../mocks";
import { Badge } from "@/demos/_shared/Badge";

interface SessionRowProps {
  session: SessionHistoryItem;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function SessionRow({ session, isActive, onClick, onDelete }: SessionRowProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="group relative flex items-center gap-2 rounded-md px-2 py-2 hover:opacity-90"
      style={{
        backgroundColor: isActive ? "var(--surface)" : "transparent",
        border: isActive ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-2 text-left min-w-0"
      >
        <MessageSquare className="h-4 w-4 shrink-0" style={{ color: "var(--muted)" }} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-xs font-medium" style={{ color: "var(--fg)" }}>
            {session.title}
          </span>
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <Badge tone="neutral" className="text-[9px] px-1 py-0">
              {session.messageCount}
            </Badge>
            <span style={{ color: "var(--muted)" }}>{session.updatedAt}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (confirming) {
            onDelete();
            setConfirming(false);
          } else {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 2500);
          }
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:opacity-100"
        style={{ color: confirming ? "var(--bad)" : "var(--muted)" }}
        aria-label={confirming ? "Confirm delete" : "Delete session"}
        title={confirming ? "Click again to confirm" : "Delete"}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
```

Note: 2-click confirmation pattern (matches production's AlertDialog intent without needing a full modal in portfolio).

- [ ] **Step 2: Create `SidebarFooter.tsx`**

Create `src/demos/taxai-chat/screens/SidebarFooter.tsx`:

```tsx
// src/demos/taxai-chat/screens/SidebarFooter.tsx
//
// Sidebar footer — language dropdown + token progress + user info + Settings/
// Signout links. Matches production AppSidebar footer (app-sidebar.tsx:196-258).

import { Settings, LogOut } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { LanguageDropdown } from "./LanguageDropdown";
import { TOKEN_QUOTA, USER_META } from "../mocks";
import { setDemoHash } from "@/demos/router";

export function SidebarFooter() {
  const pct = Math.round((TOKEN_QUOTA.used / TOKEN_QUOTA.limit) * 100);

  return (
    <div
      className="flex flex-col gap-4 border-t p-4"
      style={{ borderColor: "var(--border)" }}
    >
      <LanguageDropdown />

      {/* Token Progress */}
      <div>
        <div className="flex items-baseline justify-between text-xs">
          <span style={{ color: "var(--muted)" }}>Tokens this month</span>
          <span className="font-medium" style={{ color: "var(--fg)" }}>
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

      {/* User Info */}
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          {USER_META.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium" style={{ color: "var(--fg)" }}>
            {USER_META.name}
          </p>
          <p className="truncate text-[10px]" style={{ color: "var(--muted)" }}>
            {USER_META.email}
          </p>
        </div>
      </div>

      <div
        className="h-px w-full"
        style={{ backgroundColor: "var(--border)" }}
      />

      {/* Settings + Sign Out */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setDemoHash("taxai-chat", "settings")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          style={{ color: "var(--muted)" }}
          onClick={() => {
            // ponytail: decorative sign out — no real auth in portfolio
            window.location.hash = "#/demos";
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-chat/screens/SessionRow.tsx src/demos/taxai-chat/screens/SidebarFooter.tsx
git commit -m "feat(taxai-chat): SessionRow with hover-delete + SidebarFooter composition"
```

---

## Task 3: ChatBubble + Conversation rewrite

**Files:**
- Create: `src/demos/taxai-chat/screens/ChatBubble.tsx`
- Modify: `src/demos/taxai-chat/screens/Conversation.tsx`

- [ ] **Step 1: Create `ChatBubble.tsx`**

Create `src/demos/taxai-chat/screens/ChatBubble.tsx`:

```tsx
// src/demos/taxai-chat/screens/ChatBubble.tsx
//
// Dual bubble with mini markdown parsing + hover-reveal action tray.
// Matches production ChatMessage (ui/chat-message.tsx:131-276).

import type { ReactNode } from "react";
import { ThumbsUp, Heart, Copy } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

// ponytail: minimal markdown parser — only **bold** and *italic*. Full
// markdown would require a library; production uses MarkdownRenderer.
function parseInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const boldEnd = text.indexOf("**", i);
    const italicEnd = text.indexOf("*", i);
    let next = -1;
    let kind: "bold" | "italic" | null = null;
    if (boldEnd >= 0 && (italicEnd < 0 || boldEnd <= italicEnd)) {
      next = boldEnd;
      kind = "bold";
    } else if (italicEnd >= 0) {
      next = italicEnd;
      kind = "italic";
    }
    if (next < 0) {
      parts.push(text.slice(i));
      break;
    }
    if (next > i) parts.push(text.slice(i, next));
    const closeMarker = kind === "bold" ? "**" : "*";
    const closeIdx = text.indexOf(closeMarker, next + closeMarker.length);
    if (closeIdx < 0) {
      parts.push(text.slice(next));
      break;
    }
    const inner = text.slice(next + closeMarker.length, closeIdx);
    parts.push(
      kind === "bold" ? (
        <strong key={`b-${key++}`}>{inner}</strong>
      ) : (
        <em key={`i-${key++}`}>{inner}</em>
      ),
    );
    i = closeIdx + closeMarker.length;
  }
  return parts;
}

export function ChatBubble({ role, content, timestamp, actions, children }: ChatBubbleProps) {
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
        <div className="whitespace-pre-wrap leading-relaxed">{parseInline(content)}</div>

        {/* Hover-reveal action tray (assistant only) */}
        {!isUser && (
          <div className="absolute -bottom-3 right-2 flex space-x-1 rounded-md border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100"
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

        {actions}
      </div>

      {timestamp && (
        <span className="mt-1 px-1 text-[10px] opacity-70" style={{ color: "var(--muted)" }}>
          {timestamp}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `Conversation.tsx` to use `ChatBubble`**

Replace the entire content of `src/demos/taxai-chat/screens/Conversation.tsx` with:

```tsx
// src/demos/taxai-chat/screens/Conversation.tsx
//
// Conversation view — header with back button + chat list using ChatBubble.
// Avatar circles per message, typing indicator, citations under assistant
// bubbles, paperclip + send composer. Uses production's chat-message
// pattern (dual bubble + hover-reveal action tray inside ChatBubble).

import { useState } from "react";
import { Paperclip, Send, FileText, ExternalLink, ChevronLeft } from "lucide-react";
import { setDemoHash } from "@/demos/router";
import { ChatBubble } from "./ChatBubble";
import { SAMPLE_MESSAGES, SAMPLE_USER } from "../mocks";

const AI_INITIALS = "AI"; // Atto Assistant

const USER_INITIALS = SAMPLE_USER.name
  .split(" ")
  .map((p) => p.charAt(0))
  .join("")
  .slice(0, 2)
  .toUpperCase();

function Avatar({ initials, accent }: { initials: string; accent: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
        accent ? "" : ""
      }`}
      style={{
        backgroundColor: accent ? "var(--accent)" : "color-mix(in srgb, var(--accent) 15%, transparent)",
        color: accent ? "var(--accent-fg)" : "var(--accent)",
      }}
    >
      {initials}
    </div>
  );
}

export function Conversation() {
  const [draft, setDraft] = useState("");
  const lastUserIndex = SAMPLE_MESSAGES.map((m) => m.role).lastIndexOf("user");
  // ponytail: typing indicator shown only after the most recent user message
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
        {SAMPLE_MESSAGES.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && <Avatar initials={AI_INITIALS} accent={false} />}
            <div className="flex flex-col gap-2 max-w-[80%]">
              {m.attachmentName && m.role === "user" && (
                <div
                  className="inline-flex items-center gap-2 rounded-md border bg-white px-2 py-1 text-xs self-end"
                  style={{ borderColor: "var(--border)" }}
                >
                  <FileText className="h-3 w-3" style={{ color: "var(--accent)" }} />
                  {m.attachmentName}
                </div>
              )}
              <ChatBubble
                role={m.role}
                content={m.content}
                timestamp={m.timestamp}
              >
                {m.attachmentName && m.role === "assistant" && (
                  <div
                    className="inline-flex items-center gap-2 rounded-md border bg-white px-2 py-1 text-xs mb-1.5 self-start"
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
            {m.role === "user" && <Avatar initials={USER_INITIALS} accent={true} />}
          </div>
        ))}

        {showTyping && (
          <div className="flex items-start gap-2">
            <Avatar initials={AI_INITIALS} accent={false} />
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
            placeholder="Ask Atto anything..."
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
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-chat/screens/ChatBubble.tsx src/demos/taxai-chat/screens/Conversation.tsx
git commit -m "feat(taxai-chat): ChatBubble with markdown parsing + Conversation rewrite"
```

---

## Task 4: Inbox rewrite + Settings rewrite

**Files:**
- Modify: `src/demos/taxai-chat/screens/Inbox.tsx`
- Modify: `src/demos/taxai-chat/screens/Settings.tsx`

- [ ] **Step 1: Rewrite `Inbox.tsx` to production AppSidebar layout**

Replace the entire content of `src/demos/taxai-chat/screens/Inbox.tsx` with:

```tsx
// src/demos/taxai-chat/screens/Inbox.tsx
//
// Production-style AppSidebar layout: branding header + new chat button +
// session history (with hover-delete) + footer (language + token + user).
// Main column shows QuickStart empty state when nothing selected.
//
// Mirrors production app-sidebar.tsx (taxai-chat production).

import { useState } from "react";
import { Plus, MessageSquare, Calculator, FileText, Globe2 } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { SessionRow } from "./SessionRow";
import { SESSION_HISTORY } from "../mocks";
import { setDemoHash } from "@/demos/router";

const QUICKSTARTS = [
  { icon: Calculator, title: "Calculate VAT on an invoice", body: "Quickly check the VAT component of any invoice amount in AED." },
  { icon: FileText, title: "Summarize a tax document", body: "Upload a PDF and get a plain-English summary with citations." },
  { icon: Globe2, title: "Explain free-zone tax treatment", body: "Walk through whether a free-zone entity qualifies for 0% corporate tax." },
];

export function Inbox() {
  const [sessions, setSessions] = useState(SESSION_HISTORY);
  const [activeId, setActiveId] = useState<string | null>("s-1");

  return (
    <div className="grid h-full grid-cols-[300px_1fr]">
      <aside
        className="flex h-full flex-col border-r"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <SidebarHeader />

        {/* New chat button */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => setDemoHash("taxai-chat", "conversation")}
            className="flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium hover:opacity-90"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* Session history */}
        <div className="flex-1 overflow-y-auto px-2 pt-3">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Recent
          </p>
          <ul className="flex flex-col gap-1">
            {sessions.map((s) => (
              <li key={s.id}>
                <SessionRow
                  session={s}
                  isActive={s.id === activeId}
                  onClick={() => {
                    setActiveId(s.id);
                    setDemoHash("taxai-chat", "conversation");
                  }}
                  onDelete={() => {
                    setSessions((prev) => prev.filter((x) => x.id !== s.id));
                    if (s.id === activeId) setActiveId(null);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        <SidebarFooter />
      </aside>

      {/* Main column: QuickStart empty state */}
      <main className="flex items-center justify-center px-6" style={{ color: "var(--muted)" }}>
        <div className="max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <MessageSquare className="h-8 w-8" />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--fg)" }}>
              How can I help with UAE tax today?
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Ask Atto anything, or pick a starter prompt below.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {QUICKSTARTS.map((q) => (
              <button
                key={q.title}
                type="button"
                onClick={() => setDemoHash("taxai-chat", "conversation")}
                className="flex flex-col items-start gap-2 rounded-md border p-4 text-left transition hover:shadow-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <q.icon className="h-4 w-4" style={{ color: "var(--accent)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{q.title}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{q.body}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `Settings.tsx` with LanguageDropdown + Subscription card**

Replace the entire content of `src/demos/taxai-chat/screens/Settings.tsx` with:

```tsx
// src/demos/taxai-chat/screens/Settings.tsx
//
// Settings — language picker (Globe dropdown) + compact Subscription card +
// Model + Account. Mirrors production settings + SubscriptionInfo card.

import { Cpu, User, Crown, Calendar } from "lucide-react";
import { Field } from "@/demos/_shared/Field";
import { LanguageDropdown } from "./LanguageDropdown";
import { TOKEN_QUOTA, SAMPLE_SUBSCRIPTION, SAMPLE_USER, PLANS } from "../mocks";

const plan = PLANS.find((p) => p.id === SAMPLE_SUBSCRIPTION.planId)!;

export function Settings() {
  const pct = Math.round((TOKEN_QUOTA.used / TOKEN_QUOTA.limit) * 100);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      {/* Language */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          Language
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Atto detects your input language and responds accordingly. Override for voice output.
        </p>
        <div className="mt-4">
          <LanguageDropdown />
        </div>
      </section>

      {/* Subscription */}
      <section>
        <h3 className="flex items-center justify-between text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Crown className="h-4 w-4" style={{ color: "var(--accent)" }} />
            Subscription
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: "color-mix(in srgb, var(--ok) 15%, transparent)",
              color: "var(--ok)",
            }}
          >
            {SAMPLE_SUBSCRIPTION.planId === "trial" ? "Trial" : "Active"}
          </span>
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {plan.name} — {plan.messageQuota.toLocaleString()} messages / {plan.interval}
        </p>

        <div
          className="mt-4 rounded-md border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-baseline justify-between text-xs">
            <span style={{ color: "var(--muted)" }}>Messages used this period</span>
            <span className="font-medium" style={{ color: "var(--fg)" }}>
              {TOKEN_QUOTA.used.toLocaleString()} / {plan.messageQuota.toLocaleString()}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Calendar className="h-4 w-4" />
            Renews on {SAMPLE_SUBSCRIPTION.expiresAt}
          </div>
          <div className="mt-4 flex gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              className="flex-1 rounded-md border px-3 py-2 text-xs font-medium hover:opacity-90"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Change Plan
            </button>
            <button
              type="button"
              className="flex-1 rounded-md px-3 py-2 text-xs font-medium hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              <Crown className="mr-2 inline h-3.5 w-3.5" />
              Upgrade
            </button>
          </div>
        </div>
      </section>

      {/* Model */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Cpu className="h-4 w-4" /> Model
        </h3>
        <div className="mt-4">
          <Field label="Reasoning model" defaultValue="GPT-4o (default)" />
        </div>
      </section>

      {/* Account */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <User className="h-4 w-4" /> Account
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Name" defaultValue={SAMPLE_USER.name} />
          <Field label="Email" defaultValue={SAMPLE_USER.email} />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: clean.

- [ ] **Step 4: Production build**

```bash
npm run build 2>&1 | tail -15
```

Expected: clean. `demo-taxai-chat` chunk should be ~16 kB.

- [ ] **Step 5: Commit**

```bash
git add src/demos/taxai-chat/screens/Inbox.tsx src/demos/taxai-chat/screens/Settings.tsx
git commit -m "feat(taxai-chat): rewrite Inbox (production sidebar) + Settings (LanguageDropdown + Subscription)"
```

---

## Task 5: Smoke test + README update

**Files:**
- Modify: `src/demos/taxai-chat/README.md`

- [ ] **Step 1: Boot dev server on port 3001**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
npm run dev -- --port 3001 > /tmp/vite-3001.log 2>&1 &
```

If port 3001 is in use, try 3002.

Wait for ready:

```bash
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf http://localhost:3001/ > /dev/null 2>&1; then
    echo "ready"; break
  fi
  sleep 0.5
done
```

- [ ] **Step 2: Verify all 3 routes serve SPA shell**

```bash
for path in "#/demos/taxai-chat" "#/demos/taxai-chat/inbox" "#/demos/taxai-chat/conversation" "#/demos/taxai-chat/settings"; do
  url="http://localhost:3001/${path}"
  size=$(curl -sf "$url" | wc -c)
  echo "$path: $size bytes"
done
```

Expected: all return ~similar byte count.

- [ ] **Step 3: Stop dev server**

```bash
pkill -f "vite.*--port 3001" || true
```

- [ ] **Step 4: Update README**

Update `src/demos/taxai-chat/README.md` to reflect the production-aligned redesign. Read current README first to match its style. Replace with:

```markdown
# TaxAI Chat

Three-screen portfolio prototype mirroring production `chat.taxai`:

**Inbox (AppSidebar) → Conversation → Settings.**

- **Inbox**: production-style sidebar with Atto branding + "New chat" button + session history (hover-reveal Trash delete) + footer with Globe language dropdown (EN/العربية), token quota progress bar, user info, Settings + Sign out.
- **Conversation**: dual-bubble chat with Atto assistant (left, `bg-muted`) and user Sara (right, `bg-primary`). Mini markdown rendering (`**bold**` + `*italic*`). Citations under assistant messages. Hover-reveal action tray (Helpful / Love it / Copy) on assistant bubbles. Typing indicator (3 dots) after last user message. Paperclip + send composer.
- **Settings**: language picker (Globe dropdown), compact Subscription card (Crown icon + plan + usage + Change Plan / Upgrade), Model picker, Account info.

Brand identity is **Atto** (production's actual AI assistant name, owned by ATTO group).

All data is synthetic; no backend, no real MongoDB / OpenAI.
```

- [ ] **Step 5: Commit README**

```bash
git add src/demos/taxai-chat/README.md
git commit -m "docs(taxai-chat): update README for production-aligned Atto redesign"
```

- [ ] **Step 6: Final typecheck + build**

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build 2>&1 | tail -15
```

Expected: both clean.

- [ ] **Step 7: Final commit (if any smoke-test fixes were needed)**

```bash
git status
```

If there are uncommitted edits from the smoke test, commit them. Otherwise skip.

---

## Self-review

**Spec coverage:**

- §3.1 Inbox (production AppSidebar) → Task 4 Step 1 ✅
- §3.2 Conversation (production chat-message) → Task 3 Step 2 ✅
- §3.3 Settings (LanguageSwitcher + SubscriptionInfo) → Task 4 Step 2 ✅
- §3.4 Visual styling (theme token mapping) → used throughout ✅
- §3.5 File changes summary → 5 new files + 4 modified files ✅

**Placeholder scan:** None. Every step has actual code.

**Type consistency:**
- `SessionHistoryItem` interface (Task 1 Step 1) matches usage in `SessionRow.tsx`.
- `Language` interface (Task 1 Step 1) matches usage in `LanguageDropdown.tsx`.
- `USER_META` const exported (Task 1 Step 1) — uses `SAMPLE_USER` which already exists.
- `ChatBubble` props (Task 3 Step 1) include `children` for attachments to be placed above bubble (production pattern).

**Ambiguity check:**
- Inbox has session list but no longer uses `CONVERSATIONS` directly. Task 4 Step 1 imports `SESSION_HISTORY` instead.
- Conversation.tsx imports `PLANS` is removed (was used in Settings only); no `PLANS` import in Conversation.
- `setDemoHash("taxai-chat", "conversation")` is used for navigation — verify `taxai-chat` is in the `DemoId` union (it is).
- `LanguageDropdown` active state is local-only (no persistence); production persists via API. Acceptable for portfolio demo.
// src/demos/taxai-chat/index.tsx
//
// Top-level shell for TaxAI Chat. Wraps Shell with thin left nav between 3
// screens. E.6: lifts activeSessionId state here so Inbox + Conversation can
// both read/write which conversation is active.

import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { TAXAI_CHAT_SCREENS, getScreenLabel } from "./routes";
import { Inbox } from "./screens/Inbox";
import { Conversation } from "./screens/Conversation";
import { Settings } from "./screens/Settings";
import { useState } from "react";

export function TaxaiChat({ theme, sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "inbox");
  const [activeSessionId, setActiveSessionId] = useState<string>("c-001");

  const nav = (
    <ul className="flex flex-col gap-1 px-2 py-2">
      {TAXAI_CHAT_SCREENS.map((s) => {
        const active = screen === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setDemoHash(theme.id, s.id)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors text-left w-full hover:opacity-80"
              style={active ? { backgroundColor: "var(--accent)", color: "var(--accent-fg)" } : { color: "var(--muted)" }}
            >
              {s.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const content = (() => {
    switch (screen) {
      case "inbox": return <Inbox activeSessionId={activeSessionId} onSelectSession={setActiveSessionId} />;
      case "conversation": return <Conversation sessionId={activeSessionId} />;
      case "settings": return <Settings />;
      default: return null;
    }
  })();

  return <Shell theme={theme} nav={nav}>{content}</Shell>;
}

// src/demos/taxai-talk/index.tsx
//
// Top-level shell for TaxAI Talk. Wraps Shell with thin top nav between 3
// screens, switches on `sub`. Surface is dark (theme tokens).

import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { TAXAI_TALK_SCREENS, getScreenLabel } from "./routes";
import { VoiceSession } from "./screens/VoiceSession";
import { Transcript } from "./screens/Transcript";
import { Settings } from "./screens/Settings";

export function TaxaiTalk({ theme, sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "voice");

  const nav = (
    <ul className="flex flex-col gap-1 px-2 py-2">
      {TAXAI_TALK_SCREENS.map((s) => {
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
      case "voice": return <VoiceSession />;
      case "transcript": return <Transcript />;
      case "settings": return <Settings />;
      default: return null;
    }
  })();

  return <Shell theme={theme} nav={nav}>{content}</Shell>;
}

// src/demos/channelflow/index.tsx
//
// Top-level shell for the Channelflow demo. Wraps the shared brand-aware
// `Shell`, mounts the icon-only sidebar (driven by the channelflow theme:
// sidebarWidth === sidebarCollapsedWidth === 64), and routes between the four
// screens defined in `./routes`.

import { useMemo } from "react";
import { Inbox, CalendarCheck, Wallet, BarChart3 } from "lucide-react";
import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { CHANNELFLOW_SCREENS, getScreenLabel } from "./routes";
import { ChannelQueue } from "./screens/ChannelQueue";
import { Bookings } from "./screens/Bookings";
import { CommissionLedger } from "./screens/CommissionLedger";
import { Analytics } from "./screens/Analytics";

const SCREEN_ICONS: Record<string, React.ReactNode> = {
  queue: <Inbox className="h-5 w-5" />,
  bookings: <CalendarCheck className="h-5 w-5" />,
  commission: <Wallet className="h-5 w-5" />,
  analytics: <BarChart3 className="h-5 w-5" />,
};

export function Channelflow({ theme, sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "queue");

  const nav = useMemo(
    () => (
      <ul className="flex flex-col items-stretch gap-0.5 px-2 py-2">
        {CHANNELFLOW_SCREENS.map((s) => {
          const active = screen === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setDemoHash(theme.id, s.id)}
                aria-label={s.label}
                aria-current={active ? "page" : undefined}
                className="group flex h-10 w-full items-center justify-center rounded-lg transition-colors"
                style={{
                  backgroundColor: active ? "var(--surface)" : "transparent",
                  color: active ? "var(--accent)" : "var(--muted)",
                  boxShadow: active ? "inset 0 0 0 1px var(--border)" : "none",
                }}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center"
                  style={{ strokeWidth: active ? 2.25 : 2 }}
                >
                  {SCREEN_ICONS[s.id]}
                </span>
                <span className="sr-only">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    ),
    [screen, theme.id],
  );

  const content = (() => {
    switch (screen) {
      case "queue":
        return <ChannelQueue />;
      case "bookings":
        return <Bookings />;
      case "commission":
        return <CommissionLedger />;
      case "analytics":
        return <Analytics />;
      default:
        return <ChannelQueue />;
    }
  })();

  return <Shell theme={theme} nav={nav}>{content}</Shell>;
}

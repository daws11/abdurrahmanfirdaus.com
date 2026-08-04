// src/demos/kitchen-fresh/index.tsx
//
// Top-level shell for the Kitchen Fresh demo. Composes the production-style
// sidebar (brand mark, menu, user card, business selector) and routes
// between the four screens defined in `./routes`.

import { useMemo, useState } from "react";
import {
  Building2,
  ClipboardList,
  Boxes,
  ArrowRightLeft,
  PowerOff,
  User,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { KITCHEN_FRESH_SCREENS, getScreenLabel } from "./routes";
import { KitchenFreshProvider } from "./context";
import { OutletSwitcher } from "./screens/OutletSwitcher";
import { DailyOps } from "./screens/DailyOps";
import { StockCheck } from "./screens/StockCheck";
import { ShiftHandoff } from "./screens/ShiftHandoff";

const SCREEN_ICONS: Record<string, React.ReactNode> = {
  outlets: <Building2 className="h-4 w-4" />,
  daily: <ClipboardList className="h-4 w-4" />,
  stock: <Boxes className="h-4 w-4" />,
  handoff: <ArrowRightLeft className="h-4 w-4" />,
};

const SCREEN_DESCRIPTIONS: Record<string, string> = {
  outlets: "Pick an outlet to load prep, stock and shift data",
  daily: "Live prep timer grid for the active outlet",
  stock: "Per-outlet stocktake checklist with +/- adjust",
  handoff: "Outgoing and incoming shift notes",
};

const MENU_HEADING = "Admin Menu";

export function KitchenFresh({
  theme,
  sub,
}: {
  theme: DemoTheme;
  sub: string | null;
}) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "outlets");

  const nav = useMemo(
    () => (
      <ul className="flex flex-col items-stretch gap-0.5 px-2 py-2">
        <li className="px-2 pb-2 pt-1 text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">
          {MENU_HEADING}
        </li>
        {KITCHEN_FRESH_SCREENS.map((s) => {
          const active = screen === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setDemoHash(theme.id, s.id)}
                aria-current={active ? "page" : undefined}
                className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                style={{
                  backgroundColor: active ? "var(--surface)" : "transparent",
                  color: active ? "var(--fg)" : "var(--muted)",
                  boxShadow: active ? "inset 0 0 0 1px var(--border)" : "none",
                }}
              >
                <span
                  className="mt-0.5 flex h-4 w-4 items-center justify-center"
                  style={{ color: active ? "var(--accent)" : "var(--muted)" }}
                >
                  {SCREEN_ICONS[s.id]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{s.label}</span>
                  <span
                    className="mt-0.5 block truncate text-[10px]"
                    style={{ color: active ? "var(--fg)" : "var(--muted)", opacity: active ? 0.75 : 1 }}
                  >
                    {SCREEN_DESCRIPTIONS[s.id]}
                  </span>
                </span>
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
      case "outlets":
        return <OutletSwitcher />;
      case "daily":
        return <DailyOps />;
      case "stock":
        return <StockCheck />;
      case "handoff":
        return <ShiftHandoff />;
      default:
        return <OutletSwitcher />;
    }
  })();

  return (
    <KitchenFreshProvider>
      <Shell theme={theme} nav={nav} rightSlot={<SidebarExtras />}>
        {content}
      </Shell>
    </KitchenFreshProvider>
  );
}

/**
 * Sidebar footer content: user card, business selector, close-shift action.
 * Mirrors the production sidebar anatomy (UnifiedSidebar.tsx).
 */
function SidebarExtras() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <div
        className="mx-3 mb-3 rounded-lg p-3"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            KF
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>
              Demo User
            </p>
            <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>
              Admin Role
            </p>
          </div>
        </div>
      </div>

      <div
        className="mx-3 mb-3 rounded-lg p-3"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="space-y-2">
          <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Business
          </div>
          <select
            defaultValue="demo-business"
            aria-label="Business selector"
            className="h-9 w-full rounded-md border px-2 text-sm focus:outline-none focus:ring-1"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--fg)",
            }}
          >
            <option value="demo-business">Demo Business</option>
            <option value="secondary-business">Secondary Business</option>
          </select>
        </div>
      </div>

      <div className="mx-3 mb-3">
        <button
          type="button"
          className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--bad)" }}
        >
          <PowerOff className="h-4 w-4" />
          <span>Close Shift</span>
        </button>
      </div>

      <div
        className="mx-3 mb-3 border-t pt-3"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={() => setUserMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={userMenuOpen}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
          style={{ color: "var(--fg)" }}
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate">Demo User</span>
          <ChevronDown
            className="ml-auto h-4 w-4 shrink-0"
            style={{ color: "var(--muted)", transform: userMenuOpen ? "rotate(180deg)" : "none" }}
          />
        </button>
      </div>
    </>
  );
}

/**
 * Shared brand mark component matching production (Clock icon on accent tile).
 */
export function KitchenFreshBrandMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--accent)",
        color: "var(--accent-fg)",
      }}
    >
      <Clock style={{ width: Math.round(size * 0.5), height: Math.round(size * 0.5) }} />
    </div>
  );
}
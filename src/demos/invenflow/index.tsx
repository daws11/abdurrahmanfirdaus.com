// src/demos/invenflow/index.tsx
//
// Top-level shell + screen router for Invenflow. Invenflow uses a vertical
// navy gradient sidebar (chrome) and no top bar. The sidebar IS the chrome.
// Nav item order mirrors the production app's sidebar (Dashboard / Boards /
// Inventory / Stocktake / Movements / Locations). "About this prototype"
// disclaimer is gone — footer slot renders a tiny version + "last updated"
// pill instead.

import { useMemo } from "react";
import {
  ClipboardList,
  Truck,
  Boxes,
  ScanLine,
  ArrowRightLeft,
  LayoutDashboard,
} from "lucide-react";
import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import {
  INVENFLOW_SCREENS,
  getInvenflowScreen,
  type InvenflowScreen,
} from "./routes";
import Purchasing from "./screens/Purchasing";
import Receiving from "./screens/Receiving";
import Stocktake from "./screens/Stocktake";
import Inventory from "./screens/Inventory";
import Movement from "./screens/Movement";

const ICONS: Record<InvenflowScreen, React.ReactNode> = {
  purchasing: <ClipboardList className="h-4 w-4" />,
  receiving: <Truck className="h-4 w-4" />,
  stocktake: <ScanLine className="h-4 w-4" />,
  inventory: <Boxes className="h-4 w-4" />,
  movement: <ArrowRightLeft className="h-4 w-4" />,
};

export function Invenflow({
  theme,
  sub,
}: {
  theme: DemoTheme;
  sub: string | null;
}) {
  useTheme(theme.id);
  const screen = getInvenflowScreen(sub);

  const nav = useMemo(
    () => (
      <ul className="space-y-0.5 px-2 py-2">
        <li className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-widest text-[#8ea1b8]">
          Workspace
        </li>
        {INVENFLOW_SCREENS.map((s) => {
          const active = screen === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setDemoHash(theme.id, s.id)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors"
                style={{
                  backgroundColor: active
                    ? "rgba(255,255,255,0.10)"
                    : "transparent",
                  color: active ? "#ffffff" : "#d8e3f1",
                  boxShadow:
                    active && "inset 3px 0 0 #ffffff" ? "inset 3px 0 0 #ffffff" : undefined,
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span style={{ color: active ? "#ffffff" : "#d8e3f1" }}>
                  {ICONS[s.id]}
                </span>
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          );
        })}
        <li className="mt-4 px-2 pb-1.5 text-[10px] font-medium uppercase tracking-widest text-[#8ea1b8]">
          Snapshot
        </li>
        <li className="px-2.5 py-2 text-[11px] leading-relaxed text-[#8ea1f1]">
          <div className="flex items-center gap-2 text-[#d8e3f1]">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Central Warehouse · 5 outlets</span>
          </div>
        </li>
      </ul>
    ),
    [screen, theme.id],
  );

  const footerSlot = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] text-[#d8e3f1]">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{ backgroundColor: "rgba(255,255,255,0.10)", color: "#ffffff" }}
        >
          v1.0
        </span>
        <span className="text-[#8ea1b8]">Last sync · 2 hours ago</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8ea1b8]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>Live snapshot · 2026-08-03</span>
      </div>
    </div>
  );

  const content = (() => {
    switch (screen) {
      case "purchasing":
        return <Purchasing />;
      case "receiving":
        return <Receiving />;
      case "stocktake":
        return <Stocktake />;
      case "inventory":
        return <Inventory />;
      case "movement":
        return <Movement />;
      default:
        return <Purchasing />;
    }
  })();

  return <Shell theme={theme} nav={nav} footerSlot={footerSlot}>{content}</Shell>;
}
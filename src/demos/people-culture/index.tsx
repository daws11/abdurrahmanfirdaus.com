// src/demos/people-culture/index.tsx
//
// Top-level shell + screen router for People & Culture. The PeopleOS brand
// uses an indigo-600 active state with a 3px left bar (rather than just a
// text color) — applied here via a CSS hook. The sidebar groups items into
// 4 production-mapped groups: Workforce, Lifecycle, Admin, Self-service.

import { useMemo } from "react";
import {
  Users,
  ClipboardCheck,
  Building2,
  Calendar,
  GraduationCap,
  FileText,
  Sparkles,
  Bell,
  Settings,
  CalendarDays,
  UserCircle2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import {
  PEOPLE_CULTURE_SCREENS,
  getScreenLabel,
  parseEmployeeCode,
  type PeopleCultureScreen,
} from "./routes";
import { Directory } from "./screens/Directory";
import { EmployeeRecord } from "./screens/EmployeeRecord";
import { OnboardingFlow } from "./screens/OnboardingFlow";
import { WorkforceOverview } from "./screens/WorkforceOverview";
import { Roster } from "./screens/Roster";
import { TimeOff } from "./screens/TimeOff";
import { MyProfile } from "./screens/MyProfile";
import { MyPay } from "./screens/MyPay";

interface NavDef {
  id: string;
  label: string;
  icon: LucideIcon;
  /** When set, clicking the item navigates to this sub-route under the
   *  people-culture demo. */
  href?: string;
  /** When set, the item is disabled (no nav target yet). */
  disabled?: boolean;
}

// 4 sidebar groups matching production's PeopleOS nav order.
const NAV_GROUPS: { label: string; items: NavDef[] }[] = [
  {
    label: "Workforce",
    items: [
      { id: "directory", label: "Directory", icon: Users, href: "directory" },
      { id: "roster", label: "Roster", icon: CalendarDays, href: "roster" },
      { id: "time-off", label: "Time off", icon: Calendar, href: "time-off" },
      { id: "workforce", label: "Overview", icon: Building2, href: "workforce" },
    ],
  },
  {
    label: "Lifecycle",
    items: [
      { id: "onboarding", label: "Onboarding", icon: ClipboardCheck, href: "onboarding" },
      { id: "training", label: "Training", icon: GraduationCap, disabled: true },
    ],
  },
  {
    label: "Admin",
    items: [
      { id: "documents", label: "Documents", icon: FileText, disabled: true },
      { id: "announcements", label: "Announcements", icon: Sparkles, disabled: true },
      { id: "alerts", label: "Alerts", icon: Bell, disabled: true },
      { id: "settings", label: "Settings", icon: Settings, disabled: true },
    ],
  },
  {
    label: "Self-service",
    items: [
      { id: "my-profile", label: "My profile", icon: UserCircle2, href: "my-profile" },
      { id: "my-pay", label: "My pay", icon: Wallet, href: "my-pay" },
    ],
  },
];

const SCREEN_ICONS: Record<PeopleCultureScreen, LucideIcon> = {
  directory: Users,
  roster: CalendarDays,
  "time-off": Calendar,
  onboarding: ClipboardCheck,
  workforce: Building2,
  "my-profile": UserCircle2,
  "my-pay": Wallet,
};

export function PeopleCulture({
  theme,
  sub,
}: {
  theme: DemoTheme;
  sub: string | null;
}) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "directory");
  const employeeCode = parseEmployeeCode(sub);

  // Group active state on the sidebar item: the active item is whichever
  // NavDef in any group matches the current screen.
  const activeId = screen;

  const nav = useMemo(
    () => (
      <div className="flex flex-col gap-3 px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = !item.disabled && item.id === activeId;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.href) setDemoHash(theme.id, item.href);
                      }}
                      disabled={item.disabled}
                      aria-current={active ? "page" : undefined}
                      data-active={active ? "true" : "false"}
                      data-disabled={item.disabled ? "true" : undefined}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition-colors"
                      style={{
                        backgroundColor: active
                          ? "rgba(238,242,255,1)"
                          : "transparent",
                        color: active
                          ? "var(--accent)"
                          : item.disabled
                            ? "var(--muted)"
                            : "var(--fg)",
                        opacity: item.disabled ? 0.5 : 1,
                        cursor: item.disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      <span
                        style={{
                          color: active
                            ? "var(--accent)"
                            : "var(--muted)",
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="truncate flex-1">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    ),
    [activeId, theme.id],
  );

  // Top bar right slot: shows the current user (synthetic), outlet picker,
  // and a notifications bell. No "UI prototype" badge, no disclaimer.
  const rightSlot = (
    <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--muted)" }}>
      <span
        className="hidden h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium md:inline-flex"
        style={{
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        All outlets
      </span>
      <button
        type="button"
        className="relative flex h-8 w-8 items-center justify-center rounded-full border hover:bg-[var(--bg)]"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        aria-label="Notifications"
      >
        <Bell className="h-3.5 w-3.5" />
        <span
          className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--accent)" }}
          aria-hidden="true"
        />
      </button>
      <div className="flex items-center gap-2 pl-1">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-fg)",
          }}
          aria-hidden="true"
        >
          AC
        </span>
        <div className="hidden text-right md:block">
          <div className="text-[12px] font-medium" style={{ color: "var(--fg)" }}>
            Alex Chen
          </div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            People &amp; Culture
          </div>
        </div>
      </div>
    </div>
  );

  const content = (() => {
    // Employee record drilldown wins over screen routing when present.
    if (employeeCode) {
      return <EmployeeRecord code={employeeCode} />;
    }
    switch (screen) {
      case "directory":
        return <Directory />;
      case "roster":
        return <Roster />;
      case "time-off":
        return <TimeOff />;
      case "onboarding":
        return <OnboardingFlow />;
      case "workforce":
        return <WorkforceOverview />;
      case "my-profile":
        return <MyProfile />;
      case "my-pay":
        return <MyPay />;
      default:
        return <Directory />;
    }
  })();

  return (
    <Shell theme={theme} nav={nav} rightSlot={rightSlot}>
      {content}
    </Shell>
  );
}

// Re-export for use in tests.
export { NAV_GROUPS, SCREEN_ICONS };
// `PEOPLE_CULTURE_SCREENS` is imported but currently only used for the
// `active` flag; exporting to keep parity with the previous contract.
export { PEOPLE_CULTURE_SCREENS };

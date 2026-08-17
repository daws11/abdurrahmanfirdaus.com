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
            setDemoHash(null);
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
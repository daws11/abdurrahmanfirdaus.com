// src/demos/taxai-wizard/index.tsx
//
// Top-level shell for TaxAI Wizard. Wraps `Shell`, mounts a numbered step nav
// (the wizard is a linear flow) and switches on `sub`.

import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { TAXAI_WIZARD_SCREENS, getScreenLabel } from "./routes";
import { Register } from "./screens/Register";
import { Plans } from "./screens/Plans";
import { Checkout } from "./screens/Checkout";
import { Dashboard } from "./screens/Dashboard";

export function TaxaiWizard({ theme, sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "register");

  // ponytail: Shell renders `nav` inside the 240px sidebar, so the step list is
  // vertical rather than the horizontal strip the plan sketched.
  const nav = (
    <ul className="flex flex-col gap-0.5 px-2 py-2">
      {TAXAI_WIZARD_SCREENS.map((s, i) => {
        const active = screen === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setDemoHash(theme.id, s.id)}
              aria-current={active ? "page" : undefined}
              className="inline-flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: active ? "var(--surface)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: "var(--border)", color: "var(--fg)" }}
              >
                {i + 1}
              </span>
              {s.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const content = (() => {
    switch (screen) {
      case "register":
        return <Register />;
      case "plans":
        return <Plans />;
      case "checkout":
        return <Checkout />;
      case "dashboard":
        return <Dashboard />;
    }
  })();

  return (
    <Shell theme={theme} nav={nav}>
      {content}
    </Shell>
  );
}

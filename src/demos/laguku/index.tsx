// src/demos/laguku/index.tsx
//
// Laguku demo renders the live laguku.co site inside an iframe, wrapped in
// the shared Shell for portfolio chrome (top bar + brand tile). No sub-routes,
// no fixtures — the live site IS the demo.

import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import type { DemoTheme } from "@/demos/_shared/theme";

// ponytail: Shell requires a `nav` prop even when the sidebar is icon-only
// or empty; pass null to render no nav items (this demo only embeds an iframe).
export function Laguku({ theme, sub: _sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);

  return (
    <Shell theme={theme} nav={null}>
      <iframe
        src="https://laguku.co"
        title="Laguku — live site"
        className="h-[calc(100dvh-56px)] w-full border-0 bg-white"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </Shell>
  );
}

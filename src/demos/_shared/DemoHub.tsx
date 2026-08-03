// src/demos/_shared/DemoHub.tsx
//
// Hub page rendered at `#/demos` (no specific demo). Shows all 5 demos as
// cards, each using its own brand color + monogram.

import { ArrowRight, FlaskConical } from "lucide-react";
import { type DemoMeta } from "../_index";
import { THEMES } from "./theme";
import { Brand } from "./Brand";
import { setDemoHash } from "../router";

export function DemoHub({ demos }: { demos: DemoMeta[] }) {
  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <header className="mx-auto max-w-5xl">
        <a
          href="/"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Portfolio
        </a>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Demo prototypes</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Five UI-only prototypes — synthetic data, no backend, no integrations
          wired. Click into any demo to see the production app, recreated from
          scratch.
        </p>
      </header>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demos.map((d) => {
          const theme = THEMES[d.id];
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDemoHash(d.id)}
              disabled={d.status === "soon"}
              className="group block rounded-md border border-border bg-card p-5 text-left transition hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Brand theme={theme} size="sm" showName={false} />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {d.division}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">{d.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d.blurb}</p>
              <div
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: theme.tokens["--accent"] }}
              >
                Open demo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mx-auto mt-10 flex max-w-5xl items-center gap-2 text-xs text-muted-foreground">
        <FlaskConical className="h-3.5 w-3.5" />
        <span>UI prototypes · synthetic data</span>
      </div>
    </div>
  );
}

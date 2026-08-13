// src/demos/_shared/DemoHub.tsx
//
// Hub page rendered at `#/demos` (no specific demo). Shows all 9 demos as
// cards, each with a real prototype screenshot + themed Brand tile.

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
          Nine UI-only prototypes — synthetic data, no backend, no integrations
          wired. Click into any demo to see the production app, recreated from
          scratch.
        </p>
      </header>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demos.map((d) => {
          const theme = THEMES[d.id];
          const external = d.externalUrl;
          const Card = external ? "a" : "button";
          const cardProps = external
            ? {
                href: external,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {
                type: "button" as const,
                onClick: () => setDemoHash(d.id),
                disabled: d.status === "soon",
              };
          return (
            <Card
              key={d.id}
              {...cardProps}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-card text-left transition hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Prototype screenshot */}
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted">
                <img
                  src={`/assets/images/demos/${d.id}.png`}
                  alt={`${d.title} prototype screenshot`}
                  className="block h-full w-full object-contain"
                />
              </div>

              {/* Brand + content */}
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <Brand theme={theme} size="md" showName={true} />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {d.division}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">{d.blurb}</p>

                <div
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium"
                  style={{ color: theme.tokens["--accent"] }}
                >
                  {external ? (
                    <>
                      Open live
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  ) : (
                    <>
                      Open demo
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </div>
              </div>
            </Card>
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
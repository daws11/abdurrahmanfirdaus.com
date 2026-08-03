/**
 * Tiny hash-based router for the 5 demos.
 *
 * Why hash routing:
 *   - Vite SPA has no server-side routing. A `BrowserRouter` would 404 on
 *     page refresh of `/demos/invenflow/...`.
 *   - Hash routes work everywhere with zero Vercel config.
 *
 * URL shape: `#/demos/{id}` (hub) and `#/demos/{id}/{screen}` (sub-route).
 *
 * No external deps. ~80 lines including the parser.
 */

import { useEffect, useState, type ComponentType } from "react";
import { DEMOS, getDemoById, type DemoId } from "./_index";
import type { DemoTheme } from "./_shared/theme";
import { DemoHub } from "./_shared/DemoHub";
import { DemoNotFound } from "./_shared/DemoNotFound";
import { Invenflow } from "./invenflow";
import { InvoiceSense } from "./invoice-sense";
import { Channelflow } from "./channelflow";
import { KitchenFresh } from "./kitchen-fresh";
import { PeopleCulture } from "./people-culture";

export interface DemoRoute {
  /** id of the demo, or null if at the hub. */
  id: DemoId | null;
  /** sub-path after the demo id (e.g. "purchasing"). May contain `/`. */
  sub: string | null;
}

function parseHash(hash: string): DemoRoute {
  // hash starts with "#/demos/..." — strip the leading "#"
  const raw = hash.replace(/^#/, "");
  if (!raw.startsWith("/demos/")) {
    return { id: null, sub: null };
  }
  const rest = raw.slice("/demos/".length);
  if (!rest) return { id: null, sub: null };
  const [idPart, ...subParts] = rest.split("/");
  const id = (DEMOS.some((d) => d.id === idPart) ? idPart : null) as
    | DemoId
    | null;
  const sub = subParts.length > 0 ? subParts.join("/") : null;
  return { id, sub };
}

export function useDemoRoute(): DemoRoute {
  const [route, setRoute] = useState<DemoRoute>(() =>
    typeof window === "undefined"
      ? { id: null, sub: null }
      : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return route;
}

export function setDemoHash(id: DemoId | null, sub?: string) {
  const next = id ? `#/demos/${id}${sub ? `/${sub}` : ""}` : "#/demos";
  if (window.location.hash === next) return;
  window.location.hash = next;
}

const DEMO_COMPONENTS: Record<DemoId, ComponentType<{ sub: string | null; theme: DemoTheme }>> = {
  invenflow: Invenflow,
  "invoice-sense": InvoiceSense,
  channelflow: Channelflow,
  "kitchen-fresh": KitchenFresh,
  "people-culture": PeopleCulture,
};

export function DemoRouter() {
  const route = useDemoRoute();

  // Hub
  if (!route.id) {
    return <DemoHub demos={DEMOS} />;
  }

  // Specific demo
  const meta = getDemoById(route.id);
  if (!meta) return <DemoNotFound />;

  if (meta.status === "soon") {
    return <ComingSoon meta={meta} />;
  }

  const Demo = DEMO_COMPONENTS[route.id];
  return <Demo sub={route.sub} theme={meta.theme} />;
}

function ComingSoon({ meta }: { meta: { id: string; title: string; division: string; blurb: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {meta.division}
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {meta.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {meta.blurb}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-400">
          Coming soon
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          This demo is in progress. Invenflow is live now — others follow in
          upcoming phases.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-xs">
          <a
            href="#/demos/invenflow"
            className="inline-flex h-9 items-center rounded-md border border-border bg-secondary px-4 text-sm font-medium hover:bg-secondary/80"
          >
            Open Invenflow →
          </a>
          <a
            href="/"
            className="inline-flex h-9 items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

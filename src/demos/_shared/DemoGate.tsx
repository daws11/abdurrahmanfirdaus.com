/**
 * DemoGate — decides whether to render the demo shell or the marketing
 * site based on the current URL hash. Re-renders on `hashchange`.
 *
 * Marketing site = anything without `#/demos` or `#/demos/...`
 * Demo shell    = `#/demos` (hub) or `#/demos/{id}` or `#/demos/{id}/{sub}`
 */

import { useEffect, useState, type ReactNode } from "react";

function isDemoHash(hash: string): boolean {
  // Accept "#/demos" (hub) and "#/demos/..." (specific demo or sub-route).
  return hash === "#/demos" || hash.startsWith("#/demos/");
}

interface DemoGateProps {
  demo: ReactNode;
  marketing: ReactNode;
}

/**
 * Render-prop patterns with React can be tricky when state lives in the
 * wrapper: the wrapper re-renders but the parent's child function doesn't
 * re-evaluate as expected. To avoid that, DemoGate takes two named children
 * (demo / marketing) and renders exactly one based on the current hash.
 */
export function DemoGate({ demo, marketing }: DemoGateProps) {
  const [isDemo, setIsDemo] = useState<boolean>(() =>
    typeof window === "undefined" ? false : isDemoHash(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setIsDemo(isDemoHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return <>{isDemo ? demo : marketing}</>;
}

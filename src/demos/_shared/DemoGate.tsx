/**
 * DemoGate — decides whether to render the marketing site, a project
 * narrative page, or the demo shell based on the current URL hash.
 * Re-renders on `hashchange`.
 *
 * Mode map:
 *   "marketing" → root or any hash that isn't demos/projects
 *   "project"   → `#/projects/{id}`
 *   "demo"      → `#/demos` or `#/demos/...`
 */

import { useEffect, useState, type ReactNode } from "react";

type Mode = "marketing" | "project" | "demo";

function detectMode(hash: string): Mode {
  if (hash === "#/demos" || hash.startsWith("#/demos/")) return "demo";
  if (hash.startsWith("#/projects/")) return "project";
  return "marketing";
}

interface DemoGateProps {
  demo: ReactNode;
  marketing: ReactNode;
  project: ReactNode;
}

export function DemoGate({ demo, marketing, project }: DemoGateProps) {
  const [mode, setMode] = useState<Mode>(() =>
    typeof window === "undefined" ? "marketing" : detectMode(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setMode(detectMode(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (mode === "demo") return <>{demo}</>;
  if (mode === "project") return <>{project}</>;
  return <>{marketing}</>;
}

/**
 * DemoGate — decides whether to render the marketing site, a project
 * narrative page, or the demo shell based on the current URL hash.
 * Re-renders on `hashchange`.
 *
 * Mode map:
 *   "marketing" → root or any hash that isn't demos/projects
 *   "project"   → `#/projects/{id}`
 *   "demo"      → `#/demos` or `#/demos/...`
 *
 * On mode change (e.g. clicking "Read the case study" from a mid-page
 * scroll position on the homepage), scrollY is reset to the top of the
 * new section. Without this, hash navigation preserves the previous
 * page's offset and the user lands mid-page.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const prevModeRef = useRef(mode);

  useEffect(() => {
    const onHash = () => setMode(detectMode(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }
  }, [mode]);

  if (mode === "demo") return <>{demo}</>;
  if (mode === "project") return <>{project}</>;
  return <>{marketing}</>;
}

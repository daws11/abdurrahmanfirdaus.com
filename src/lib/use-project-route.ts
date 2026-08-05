/**
 * Hash-based route hook for the project pages.
 *
 * Why hash routing: matches the demo router's approach — see
 * `src/demos/router.tsx`. URL shape: `#/projects/{id}`.
 */

import { useEffect, useState } from "react";
import { DEMOS, type DemoId } from "@/demos/_index";

export interface ProjectRoute {
  /** id of the project, or null if at the hub or invalid. */
  id: DemoId | null;
}

function parseHash(hash: string): ProjectRoute {
  // hash starts with "#/projects/..." — strip the leading "#"
  const raw = hash.replace(/^#/, "");
  if (!raw.startsWith("/projects/")) {
    return { id: null };
  }
  const rest = raw.slice("/projects/".length);
  if (!rest) return { id: null };
  const idPart = rest.split("/")[0];
  const id = (DEMOS.some((d) => d.id === idPart) ? idPart : null) as
    | DemoId
    | null;
  return { id };
}

export function useProjectRoute(): ProjectRoute {
  const [route, setRoute] = useState<ProjectRoute>(() =>
    typeof window === "undefined"
      ? { id: null }
      : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return route;
}

export function setProjectHash(id: DemoId | null) {
  const next = id ? `#/projects/${id}` : "#/projects";
  if (window.location.hash === next) return;
  window.location.hash = next;
}
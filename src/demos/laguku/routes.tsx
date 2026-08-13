// src/demos/laguku/routes.tsx
//
// Laguku demo has no sub-screens — it's a single iframe embedding the live
// laguku.co site. The router passes `sub` but we ignore it; if a sub route
// is requested we simply render the same iframe.

export type LagukuScreen = "live";

export const LAGUKU_SCREENS: { id: LagukuScreen; label: string }[] = [
  { id: "live", label: "Live" },
];

export function getScreenLabel(_sub: string | null, fallback: LagukuScreen): LagukuScreen {
  return fallback;
}

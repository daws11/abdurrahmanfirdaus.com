// src/demos/people-culture/routes.tsx
//
// Typed sub-routes for the People & Culture demo. URL shape:
//   #/demos/people-culture/directory     — default landing
//   #/demos/people-culture/employee/:code
//   #/demos/people-culture/onboarding
//   #/demos/people-culture/workforce
//
// The router in src/demos/router.tsx passes the parsed `sub` to the
// PeopleCulture component, which switches on it via `getScreenLabel` below.

export type PeopleCultureScreen =
  | "directory"
  | "onboarding"
  | "workforce";

export interface PeopleCultureScreenMeta {
  id: PeopleCultureScreen;
  label: string;
}

export const PEOPLE_CULTURE_SCREENS: PeopleCultureScreenMeta[] = [
  { id: "directory", label: "Directory" },
  { id: "onboarding", label: "Onboarding" },
  { id: "workforce", label: "Workforce" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: PeopleCultureScreen,
): PeopleCultureScreen {
  if (!sub) return fallback;
  // EmployeeRecord is reached by clicking a row; it shares the directory
  // screen's parent but is a different sub-route.
  if (sub.startsWith("employee/")) return "directory";
  const found = PEOPLE_CULTURE_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as PeopleCultureScreen;
}

export function parseEmployeeCode(sub: string | null): string | null {
  if (!sub) return null;
  const m = sub.match(/^employee\/([A-Za-z0-9-]+)$/);
  return m ? m[1] : null;
}

// src/demos/taxai-talk/routes.tsx
//
// TaxAI Talk sub-routes: voice (default) → transcript → settings.

export type TaxaiTalkScreen = "voice" | "transcript" | "settings";

export const TAXAI_TALK_SCREENS: { id: TaxaiTalkScreen; label: string }[] = [
  { id: "voice", label: "Voice" },
  { id: "transcript", label: "Transcript" },
  { id: "settings", label: "Settings" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: TaxaiTalkScreen,
): TaxaiTalkScreen {
  if (!sub) return fallback;
  const found = TAXAI_TALK_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as TaxaiTalkScreen;
}

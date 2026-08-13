// src/demos/taxai-chat/routes.tsx
//
// TaxAI Chat sub-routes: inbox (default) → conversation → settings.

export type TaxaiChatScreen = "inbox" | "conversation" | "settings";

export const TAXAI_CHAT_SCREENS: { id: TaxaiChatScreen; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "conversation", label: "Conversation" },
  { id: "settings", label: "Settings" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: TaxaiChatScreen,
): TaxaiChatScreen {
  if (!sub) return fallback;
  const found = TAXAI_CHAT_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as TaxaiChatScreen;
}

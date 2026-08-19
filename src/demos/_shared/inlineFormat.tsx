// src/demos/_shared/inlineFormat.tsx
//
// Minimal **bold** parser used by the taxai-talk Conversation summary card
// (E.11). ChatBubble dropped the parser in E.10 — only the structured
// transcript summary retains the bold syntax for the key-term section.
//
// Handles unclosed `**` gracefully: a stray opener falls through as text.

import type { ReactNode } from "react";

export function parseInlineBold(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const openIdx = text.indexOf("**", i);
    if (openIdx < 0) {
      parts.push(text.slice(i));
      break;
    }
    if (openIdx > i) parts.push(text.slice(i, openIdx));
    const closeIdx = text.indexOf("**", openIdx + 2);
    if (closeIdx < 0) {
      parts.push(text.slice(openIdx));
      break;
    }
    parts.push(
      <strong key={`b-${key++}`}>{text.slice(openIdx + 2, closeIdx)}</strong>,
    );
    i = closeIdx + 2;
  }
  return parts;
}
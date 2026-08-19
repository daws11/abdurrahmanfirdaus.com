// src/demos/taxai-talk/mocks.ts
//
// Synthetic fixtures for TaxAI Talk. Refit to tax context per spec: the
// talk.taxai.ae production is a generic voice assistant, but the portfolio
// re-frames it to a UAE tax voice Q&A demo. Voices are ElevenLabs-style
// names from public knowledge.

export type VoiceId = "aria" | "river" | "sarah" | "george";

export interface Voice {
  id: VoiceId;
  name: string;
  language: "EN" | "AR" | "Multilingual";
  description: string;
}

export interface TranscriptTurn {
  id: string;
  role: "user" | "assistant";
  language: "EN" | "AR";
  content: string;
  audioUrl?: string;
  timestamp: string;
}

export const VOICES: Voice[] = [
  { id: "aria", name: "Aria", language: "Multilingual", description: "Warm, clear, balanced — default ElevenLabs voice." },
  { id: "river", name: "River", language: "EN", description: "Calm, conversational, low pitch." },
  { id: "sarah", name: "Sarah", language: "EN", description: "Professional, news-anchor style." },
  { id: "george", name: "George", language: "EN", description: "Deep, authoritative, formal." },
];

export const SAMPLE_TRANSCRIPT: TranscriptTurn[] = [
  { id: "t-1", role: "user", language: "EN", content: "What's the VAT rate for restaurants in the UAE?", timestamp: "00:00" },
  { id: "t-2", role: "assistant", language: "EN", content: "The standard VAT rate in the UAE is 5%, applicable to restaurant food and non-alcoholic beverages. There is no distinction between dine-in and takeaway in the Federal Decree-Law.", timestamp: "00:03" },
  { id: "t-3", role: "user", language: "AR", content: "وماذا عن الضريبة الانتقائية على المشروبات الغازية؟", timestamp: "00:14" },
  { id: "t-4", role: "assistant", language: "AR", content: "الضريبة الانتقائية على المشروبات الغازية 50 في المئة، وعلى منتجات التبغ 100 في المئة، وعلى مشروبات الطاقة 100 في المئة أيضاً. تُفرض هذه الضريبة في نقطة الاستيراد أو الإفراج من المستودع الخاضع للضريبة الانتقائية.", timestamp: "00:17" },
  { id: "t-5", role: "user", language: "EN", content: "Thanks. Can you also tell me about corporate tax registration?", timestamp: "00:34" },
  { id: "t-6", role: "assistant", language: "EN", content: "Corporate tax registration with the Federal Tax Authority is mandatory for UAE resident juridical persons, and for non-resident persons with a permanent establishment in the UAE. The registration window depends on when your business was established.", timestamp: "00:37" },
];

export const CONVERSATION_SUMMARY = `The user asked three questions about UAE taxation in a multilingual conversation (English + Arabic):

1. **VAT on restaurants** — confirmed the standard 5% VAT rate applies uniformly to dine-in and takeaway food, with no carve-outs in the Federal Decree-Law.

2. **Excise tax on beverages and tobacco** — clarified Excise Tax rates: 50% on carbonated beverages, 100% on tobacco products, and 100% on energy drinks. Tax is triggered at import or release from an excise warehouse.

3. **Corporate Tax registration** — explained that Federal Tax Authority registration is mandatory for UAE-resident juridical persons and non-residents with a permanent establishment, with deadlines tied to the date of business establishment.

**Key terms surfaced:** Federal Decree-Law No. 8 of 2017, Federal Tax Authority, Excise Warehouse, Permanent Establishment.

**Recommended next steps:** Review the user's specific business activity codes (VAT and CT) and confirm any goods that may qualify for designated-zone VAT relief. Open corporate tax registration flow via the EmaraTax portal if establishment date is approaching the 9-month deadline.`;

/**
 * E.5 — synthetic Conclusion copy shown in the post-session modal. Atto is
 * the assistant name shared with taxai-chat (see E.13 for cross-demo
 * brand carry-through).
 */
export const CONCLUSION_HEADLINE = "Session with Atto";

export const CONCLUSION_BODY =
  "Your conversation covered UAE tax topics across English and Arabic. " +
  "Atto cited the relevant Federal Decree-Law sections and Executive Regulations " +
  "where applicable. Below is a recap of what was discussed.";

export const CONCLUSION_CTAS = {
  save: "Save & email",
  restart: "Restart session",
} as const;

/**
 * E.7 — synthetic turn timeline that streams in during a voice session.
 * Each entry fires once when elapsed seconds since mic activation crosses
 * `afterSec`. Mix of user + assistant EN/AR to mirror SAMPLE_TRANSCRIPT.
 */
export const SIMULATED_TURNS: { afterSec: number; turn: Omit<TranscriptTurn, "id"> }[] = [
  { afterSec: 4, turn: { role: "assistant", language: "EN", content: "The standard VAT rate in the UAE is 5%, applicable to restaurant food and non-alcoholic beverages.", timestamp: "00:04" } },
  { afterSec: 8, turn: { role: "user", language: "EN", content: "And what about alcohol if the restaurant is licensed?", timestamp: "00:08" } },
  { afterSec: 14, turn: { role: "assistant", language: "EN", content: "Alcoholic beverages are subject to excise tax at 50% in addition to the 5% VAT. The excise is levied at the point of import or release from an excise warehouse.", timestamp: "00:14" } },
  { afterSec: 18, turn: { role: "user", language: "AR", content: "وماذا عن الضريبة الانتقائية على المشروبات الغازية؟", timestamp: "00:18" } },
  { afterSec: 25, turn: { role: "assistant", language: "AR", content: "الضريبة الانتقائية على المشروبات الغازية 50 في المئة، وعلى منتجات التبغ 100 في المئة، وعلى مشروبات الطاقة 100 في المئة أيضاً.", timestamp: "00:25" } },
  { afterSec: 30, turn: { role: "user", language: "EN", content: "Thanks. Can you tell me about corporate tax registration too?", timestamp: "00:30" } },
];

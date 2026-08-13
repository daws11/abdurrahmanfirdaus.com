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

export const SELECTED_VOICE: VoiceId = "aria";

// src/demos/taxai-chat/mocks.ts
//
// Synthetic fixtures for TaxAI Chat: conversation list with UAE tax topics,
// sample message bubbles, token usage, and language settings.

export interface Conversation {
  id: string;
  title: string;
  topic: "VAT" | "Corporate Tax" | "Free Zones" | "Excise" | "Transfer Pricing";
  preview: string;
  updatedAt: string;
  messageCount: number;
  unread?: boolean;
  online?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  attachmentName?: string;
  citations?: { source: string; snippet: string }[];
  timestamp: string;
}

export const CONVERSATIONS: Conversation[] = [
  { id: "c-001", title: "VAT rate on restaurant food", topic: "VAT", preview: "The standard VAT rate in the UAE is 5%...", updatedAt: "2026-08-13", messageCount: 8, unread: true, online: true },
  { id: "c-002", title: "Corporate tax registration threshold", topic: "Corporate Tax", preview: "Businesses with taxable income above AED 375,000...", updatedAt: "2026-08-12", messageCount: 14 },
  { id: "c-003", title: "Free zone qualifying income", topic: "Free Zones", preview: "Qualifying Free Zone Persons can benefit from 0%...", updatedAt: "2026-08-11", messageCount: 22, online: true },
  { id: "c-004", title: "Excise tax on soft drinks", topic: "Excise", preview: "Excise tax is 50% on carbonated drinks...", updatedAt: "2026-08-10", messageCount: 6 },
  { id: "c-005", title: "Transfer pricing documentation", topic: "Transfer Pricing", preview: "Maintain a Master File, Local File, and CbCR...", updatedAt: "2026-08-08", messageCount: 19 },
  { id: "c-006", title: "VAT on imported services", topic: "VAT", preview: "Reverse charge mechanism applies when...", updatedAt: "2026-08-05", messageCount: 11 },
];

export const SAMPLE_MESSAGES: Message[] = [
  {
    id: "m-1", conversationId: "c-001", role: "user",
    content: "What's the VAT rate for restaurants in the UAE? And does it differ for dine-in vs takeaway?",
    timestamp: "10:42",
  },
  {
    id: "m-2", conversationId: "c-001", role: "assistant",
    content: "The standard VAT rate in the UAE is **5%**, and it applies uniformly to restaurant food and non-alcoholic beverages — there's no distinction between dine-in and takeaway in the Federal Decree-Law No. (8) of 2017.\n\nThat said, the Executive Regulations clarify that **catering services** (where the supplier provides preparation and delivery as a bundled service) follow the same 5% rate. If a restaurant only delivers prepared food without service, it's still 5%.",
    citations: [
      { source: "Federal Decree-Law No. (8) of 2017, Art. 2", snippet: "A supply of goods or services is considered to take place in the State..." },
      { source: "Executive Regulations, Art. 13", snippet: "Restaurant and catering services shall be considered as supplies of services..." },
    ],
    timestamp: "10:42",
  },
  {
    id: "m-3", conversationId: "c-001", role: "user",
    content: "Got it. And what about alcoholic beverages if a restaurant is licensed?",
    timestamp: "10:44",
  },
  {
    id: "m-4", conversationId: "c-001", role: "assistant",
    content: "Alcoholic beverages are subject to **excise tax at 50%** (in addition to the 5% VAT). The excise is levied at the point of import or release from an excise warehouse, so the restaurant would purchase them excise-paid from the importer.",
    attachmentName: "excise-tax-schedule-2024.pdf",
    timestamp: "10:44",
  },
  {
    id: "m-5", conversationId: "c-001", role: "user",
    content: "Thanks — that's exactly what I needed. One more: are there any upcoming VAT changes I should be aware of for Q4?",
    timestamp: "10:47",
  },
];

export const TOKEN_QUOTA = { used: 18_420, limit: 50_000 };

// Signed-in user, shown as the sidebar profile mini, the message avatar, and
// the Settings photo placeholder. Same person as the taxai-wizard fixture.
export interface User {
  name: string;
  email: string;
  jobTitle: string;
  country: string;
}

export const SAMPLE_USER: User = {
  name: "Sara Al-Mansouri",
  email: "sara.mansouri@example.ae",
  jobTitle: "Freelance Tax Consultant",
  country: "United Arab Emirates",
};

export const initials = SAMPLE_USER.name
  .split(" ")
  .map((p) => p.charAt(0))
  .join("")
  .slice(0, 2)
  .toUpperCase();

// SESSION_HISTORY — past chat sessions for the sidebar list (derived from
// CONVERSATIONS so titles and counts stay in sync; id is reused directly
// since CONVERSATIONS already uses `c-001`–`c-006` ids)
export interface SessionHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export const SESSION_HISTORY: SessionHistoryItem[] = CONVERSATIONS.map(
  ({ id, title, updatedAt, messageCount }) => ({ id, title, updatedAt, messageCount }),
);

// USER_META — sidebar footer user info (extends SAMPLE_USER; initials reuses
// the existing initials export to keep a single source of truth)
export const USER_META = {
  initials,
  name: SAMPLE_USER.name,
  email: SAMPLE_USER.email,
};

// LANGUAGES — language dropdown options (matches production's EN/AR)
export interface Language {
  code: "en" | "ar";
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

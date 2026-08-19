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

/**
 * E.6 — Per-conversation message threads. Each conversation in CONVERSATIONS
 * has its own thread of 4-8 messages covering its declared topic. c-001 (VAT)
 * retains the existing 5 messages; the other 5 conversations get fresh
 * authored threads. Plain text only — see E.10 (markdown parser dropped).
 *
 * Topic distribution:
 *   c-001 VAT                 — restaurant VAT + excise + Q4 changes
 *   c-002 Corporate Tax       — registration threshold + 9% rate
 *   c-003 Free Zones          — qualifying income + de minimis
 *   c-004 Excise              — beverages + tobacco + warehouse regime
 *   c-005 Transfer Pricing    — Master File + Local File + substance
 *   c-006 VAT imported svcs   — reverse charge + place of supply
 */

export const MESSAGES_BY_CONVERSATION: Record<string, Message[]> = {
  // c-001 — VAT (existing 5-message thread, plain text — no ** markers)
  "c-001": [
    {
      id: "m-1", conversationId: "c-001", role: "user",
      content: "What's the VAT rate for restaurants in the UAE? And does it differ for dine-in vs takeaway?",
      timestamp: "10:42",
    },
    {
      id: "m-2", conversationId: "c-001", role: "assistant",
      content: "The standard VAT rate in the UAE is 5%, and it applies uniformly to restaurant food and non-alcoholic beverages — there's no distinction between dine-in and takeaway in the Federal Decree-Law No. (8) of 2017.\n\nThat said, the Executive Regulations clarify that catering services (where the supplier provides preparation and delivery as a bundled service) follow the same 5% rate. If a restaurant only delivers prepared food without service, it's still 5%.",
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
      content: "Alcoholic beverages are subject to excise tax at 50% (in addition to the 5% VAT). The excise is levied at the point of import or release from an excise warehouse, so the restaurant would purchase them excise-paid from the importer.",
      attachmentName: "excise-tax-schedule-2024.pdf",
      timestamp: "10:44",
    },
    {
      id: "m-5", conversationId: "c-001", role: "user",
      content: "Thanks — that's exactly what I needed. One more: are there any upcoming VAT changes I should be aware of for Q4?",
      timestamp: "10:47",
    },
    {
      id: "m-6", conversationId: "c-001", role: "assistant",
      content: "No major rate changes are scheduled for Q4 2026 — the 5% standard rate stays. The Federal Tax Authority did publish a Public Clarification in July on VAT treatment of crypto assets, classifying them as digital services subject to the standard rate unless they qualify as financial services. Worth a read if your business touches that space.",
      timestamp: "10:47",
    },
  ],

  // c-002 — Corporate Tax (registration threshold + 9% rate)
  "c-002": [
    {
      id: "m-7", conversationId: "c-002", role: "user",
      content: "When does corporate tax kick in for a UAE company? Is it on all profit or just above a threshold?",
      timestamp: "Yesterday 14:12",
    },
    {
      id: "m-8", conversationId: "c-002", role: "assistant",
      content: "Corporate Tax in the UAE applies at 0% on taxable income up to AED 375,000, and 9% on taxable income above that threshold. So a small business with AED 300,000 in taxable profit pays zero corporate tax — but they still need to register and file.",
      citations: [
        { source: "Federal Decree-Law No. (47) of 2022, Art. 3", snippet: "Corporate Tax shall be imposed on the Taxable Income of a Taxable Person at the following rates..." },
      ],
      timestamp: "Yesterday 14:12",
    },
    {
      id: "m-9", conversationId: "c-002", role: "user",
      content: "What's the registration deadline? We're a new company incorporated in March 2026.",
      timestamp: "Yesterday 14:15",
    },
    {
      id: "m-10", conversationId: "c-002", role: "assistant",
      content: "For a UAE resident juridical person, you must register within 9 months after the end of your first financial year. If your first financial year ends Dec 31 2026, the deadline is Sep 30 2027. If you incorporated in March 2026 and decide to use a March-February year-end, your deadline would be November 30 2027.",
      timestamp: "Yesterday 14:15",
    },
    {
      id: "m-11", conversationId: "c-002", role: "user",
      content: "Useful. And are there any deductions I should know about for the first year?",
      timestamp: "Yesterday 14:18",
    },
    {
      id: "m-12", conversationId: "c-002", role: "assistant",
      content: "Yes — the corporate tax law allows deduction of all business expenditures incurred wholly and exclusively for the business, similar to a classic income tax. You can also carry forward tax losses indefinitely (no time limit), and there's a 0% rate on intra-group transfers meeting the participation exemption conditions (95% ownership, ≥12-month holding period, qualifying subsidiary).",
      timestamp: "Yesterday 14:18",
    },
  ],

  // c-003 — Free Zones (qualifying income + de minimis)
  "c-003": [
    {
      id: "m-13", conversationId: "c-003", role: "user",
      content: "We're a free zone company selling to mainland UAE customers. Do we pay 0% or 9% corporate tax?",
      timestamp: "2 days ago 09:30",
    },
    {
      id: "m-14", conversationId: "c-003", role: "assistant",
      content: "It depends on whether you qualify as a Qualifying Free Zone Person (QFZP) AND whether the income in question is qualifying income.\n\nQualifying income is broadly: transactions with other Free Zone Persons, exports out of the UAE, and certain categories of income from a Qualifying Free Zone Activity. Sales to UAE mainland customers are NOT qualifying income — they're taxed at the standard 9% rate.",
      citations: [
        { source: "Federal Decree-Law No. (47) of 2022, Art. 18", snippet: "A Qualifying Free Zone Person shall be subject to Corporate Tax at the rate of zero per cent..." },
        { source: "Cabinet Decision No. (55) of 2023, Art. 5", snippet: "Qualifying Income means income derived by a Qualifying Free Zone Person from..." },
      ],
      timestamp: "2 days ago 09:30",
    },
    {
      id: "m-15", conversationId: "c-003", role: "user",
      content: "Is there a de minimis threshold on the mainland income before the 9% kicks in?",
      timestamp: "2 days ago 09:34",
    },
    {
      id: "m-16", conversationId: "c-003", role: "assistant",
      content: "Yes — a de minimis threshold applies. The current rule allows up to a small percentage (currently 5% of total revenue or AED 5 million, whichever is lower) of mainland (non-qualifying) income to still be treated as qualifying income. Anything above that threshold gets taxed at the standard 9% rate.\n\nThe FTA issued a Public Clarification in late 2025 confirming this applies on a yearly basis, not cumulatively.",
      timestamp: "2 days ago 09:34",
    },
    {
      id: "m-17", conversationId: "c-003", role: "user",
      content: "And what does it take to qualify as a QFZP — substance requirements?",
      timestamp: "2 days ago 09:38",
    },
    {
      id: "m-18", conversationId: "c-003", role: "assistant",
      content: "The Qualifying Free Zone Person test requires: (a) the entity is incorporated in a designated free zone, (b) it maintains adequate substance in that free zone (people, premises, decision-making), (c) it earns only qualifying income or elects to be taxed at 9% across all income, and (d) it doesn't elect out of the regime. The election to be taxed at 9% is irrevocable for 5 tax periods.",
      timestamp: "2 days ago 09:38",
    },
  ],

  // c-004 — Excise (beverages + tobacco + warehouse regime)
  "c-004": [
    {
      id: "m-19", conversationId: "c-004", role: "user",
      content: "Quick one — what's the excise tax rate on energy drinks vs regular soda?",
      timestamp: "3 days ago 11:00",
    },
    {
      id: "m-20", conversationId: "c-004", role: "assistant",
      content: "Carbonated beverages (regular soda): 50%. Energy drinks: 100%. Sugar-sweetened beverages (added to the list in 2019): 50%. Tobacco products (cigarettes, shisha tobacco, etc.): 100%. E-cigarette liquid: 100%.",
      timestamp: "3 days ago 11:00",
    },
    {
      id: "m-21", conversationId: "c-004", role: "user",
      content: "When is the trigger — import or sale?",
      timestamp: "3 days ago 11:03",
    },
    {
      id: "m-22", conversationId: "c-004", role: "assistant",
      content: "Excise tax is triggered at the earlier of (a) the import of excise goods into the UAE, or (b) the release of excise goods from an excise warehouse. Once paid, the goods can move freely in the market — the importer/business owner buys excise-paid stock.",
      citations: [
        { source: "Federal Decree-Law No. (7) of 2017, Art. 4", snippet: "Excise Goods shall be subject to Excise Tax at the rate specified..." },
      ],
      timestamp: "3 days ago 11:03",
    },
    {
      id: "m-23", conversationId: "c-004", role: "user",
      content: "Got it. What does the warehouse regime actually look like in practice?",
      timestamp: "3 days ago 11:06",
    },
    {
      id: "m-24", conversationId: "c-004", role: "assistant",
      content: "An excise warehouse is a designated storage facility where excise goods can be held without triggering the tax. The warehouse operator is registered with the FTA, files monthly returns, and tracks inventory movements. Goods inside the warehouse can move between warehouses (e.g., from port to inland warehouse) without triggering tax until they're released for consumption in the UAE market.",
      timestamp: "3 days ago 11:06",
    },
  ],

  // c-005 — Transfer Pricing (Master File + Local File + substance)
  "c-005": [
    {
      id: "m-25", conversationId: "c-005", role: "user",
      content: "Our group has 3 UAE entities and we do intercompany services — do we need transfer pricing documentation?",
      timestamp: "5 days ago 16:20",
    },
    {
      id: "m-26", conversationId: "c-005", role: "assistant",
      content: "Depends on revenue thresholds. The Federal Tax Authority's rules require:\n\n- Local File: required for any UAE entity with related-party transactions exceeding AED 4 million in either direction in a financial year.\n- Master File: required for UAE entities part of a multinational group with consolidated revenue of AED 200 million or more in the preceding financial year.\n- CbCR: required for groups with consolidated revenue of AED 3.15 billion or more.\n\nYour situation — intercompany services between 3 UAE entities — almost certainly triggers Local File at minimum.",
      citations: [
        { source: "Cabinet Decision No. (32) of 2023, Art. 11", snippet: "A Taxable Person shall maintain a Local File where the total value of Related Party Transactions..." },
      ],
      timestamp: "5 days ago 16:20",
    },
    {
      id: "m-27", conversationId: "c-005", role: "user",
      content: "What does the Local File actually need to contain?",
      timestamp: "5 days ago 16:24",
    },
    {
      id: "m-28", conversationId: "c-005", role: "assistant",
      content: "The Local File needs: (a) organizational structure of the UAE entity, (b) description of business and strategy, (c) controlled transactions with details and amounts, (d) comparability analysis, (e) selection of the most appropriate transfer pricing method (CUP, resale minus, cost plus, TNMM, profit split), and (f) application of that method with the comparables used.\n\nThe Master File is broader — group structure, business description, intangibles, intercompany financial activities, and the group's financial and tax positions.",
      timestamp: "5 days ago 16:24",
    },
    {
      id: "m-29", conversationId: "c-005", role: "user",
      content: "Does the FTA actually check substance?",
      timestamp: "5 days ago 16:27",
    },
    {
      id: "m-30", conversationId: "c-005", role: "assistant",
      content: "Yes, increasingly. The FTA has been signalling that substance matters — they want to see that the UAE entity has the people, premises, and decision-making authority to support the profits booked. A UAE entity that's a shell with a couple of employees but books significant service-fee income will get scrutiny. Their auditors look at: where are decisions made, who signs off, where are the people sitting, what systems are run locally.",
      timestamp: "5 days ago 16:27",
    },
  ],

  // c-006 — VAT on imported services (reverse charge)
  "c-006": [
    {
      id: "m-31", conversationId: "c-006", role: "user",
      content: "We bought a SaaS subscription from a US company. Do we pay VAT on it?",
      timestamp: "6 days ago 10:05",
    },
    {
      id: "m-32", conversationId: "c-006", role: "assistant",
      content: "Yes — when a UAE business receives services from a non-UAE supplier, the recipient must account for VAT under the reverse charge mechanism. You treat the imported service as if you supplied it to yourself: calculate 5% VAT on the value of the service, and report it both as output VAT (your own liability) and input VAT (which you can recover) on the same VAT return.",
      citations: [
        { source: "Federal Decree-Law No. (8) of 2017, Art. 48", snippet: "A Recipient shall be treated as making a Taxable Supply to himself where services are received from a non-resident supplier..." },
      ],
      timestamp: "6 days ago 10:05",
    },
    {
      id: "m-33", conversationId: "c-006", role: "user",
      content: "Wait — both output AND input on the same amount? So it nets to zero?",
      timestamp: "6 days ago 10:08",
    },
    {
      id: "m-34", conversationId: "c-006", role: "assistant",
      content: "Exactly — for a business that makes taxable supplies, the reverse charge is a wash. You declare AED 100 of output VAT and AED 100 of input VAT on the same line of the VAT return. The reverse charge mechanism primarily affects exempt businesses (which can't recover input VAT, so the imported service becomes a real cost) and tracking the place-of-supply rules.",
      timestamp: "6 days ago 10:08",
    },
    {
      id: "m-35", conversationId: "c-006", role: "user",
      content: "One last — what counts as imported services exactly? Is a US-hosted cloud different?",
      timestamp: "6 days ago 10:12",
    },
    {
      id: "m-36", conversationId: "c-006", role: "assistant",
      content: "Imported services are services received by a UAE business from a supplier outside the UAE, used in the UAE. The location of where the supplier hosts the service doesn't matter — what matters is whether the supplier is established outside the UAE and you as the recipient are in the UAE.\n\nCloud services (AWS, Azure, Google Cloud) are imported services when consumed by a UAE business, regardless of which data center region the workload runs in. The reverse charge applies.",
      timestamp: "6 days ago 10:12",
    },
  ],
};

/** E.6 — Lookup messages for a conversation id, with fallback to c-001. */
export function getMessagesForConversation(id: string): Message[] {
  return MESSAGES_BY_CONVERSATION[id] ?? MESSAGES_BY_CONVERSATION["c-001"];
}

/** Backwards-compat alias — kept for any other consumer that imports
 *  SAMPLE_MESSAGES directly (E.4's initial state read it). */
export const SAMPLE_MESSAGES = MESSAGES_BY_CONVERSATION["c-001"];

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

// PLANS + SAMPLE_SUBSCRIPTION — Settings page subscription card. Plan shape
// mirrors taxai-wizard/mocks.ts (single source of plan data, but kept local
// here since each demo is self-contained per project rules).
// ponytail: taxai-chat owns its own plan fixtures so the demo doesn't depend
// on taxai-wizard mocks.
export interface Plan {
  id: "trial" | "monthly" | "quarterly" | "yearly";
  name: string;
  priceUsd: number;
  interval: "14 days" | "month" | "quarter" | "year";
  messageQuota: number;
}

export const PLANS: Plan[] = [
  { id: "trial", name: "Free Trial", priceUsd: 0, interval: "14 days", messageQuota: 10 },
  { id: "monthly", name: "Monthly Plan", priceUsd: 99, interval: "month", messageQuota: 100 },
  { id: "quarterly", name: "Quarterly Plan", priceUsd: 250, interval: "quarter", messageQuota: 300 },
  { id: "yearly", name: "Yearly Plan", priceUsd: 899, interval: "year", messageQuota: 1200 },
];

export interface Subscription {
  planId: Plan["id"];
  startedAt: string;
  expiresAt: string;
}

export const SAMPLE_SUBSCRIPTION: Subscription = {
  planId: "quarterly",
  startedAt: "2026-07-15",
  expiresAt: "2026-10-15",
};

/**
 * Topic-aware canned assistant replies. E.4: composer appends one of these
 * after a 900ms typing delay. Plain text only — see E.10 (markdown parser
 * dropped). Each topic has 3-4 short replies (1-2 sentences each).
 */
export const CANNED_REPLIES: Record<Conversation["topic"], string[]> = {
  VAT: [
    "The standard VAT rate in the UAE is 5%, applied to most goods and services. Restaurant food, retail goods, and professional services all fall under the standard rate unless explicitly exempted.",
    "For VAT registration, the threshold is AED 375,000 in taxable turnover over 12 months. Mandatory registration kicks in once you cross that. Voluntary registration is possible earlier — useful for businesses recovering input VAT on stock.",
    "Designated zones get a special VAT treatment for goods: supplies between businesses in designated zones can be treated as outside the scope of VAT, similar to a free zone for corporate tax. Services don't get the same treatment — they're taxable regardless of where the supplier sits.",
  ],
  "Corporate Tax": [
    "Corporate Tax in the UAE applies at 9% on taxable income above AED 375,000. Below that threshold, the rate is 0% — so small businesses and free zone qualifying income pay effectively nothing.",
    "Registration with the Federal Tax Authority is mandatory for UAE resident juridical persons, and for non-residents with a permanent establishment in the UAE. The deadline depends on when the business was established — typically 9 months after the financial year-end.",
    "For transfer pricing, you'll need a Master File and Local File if you meet the revenue thresholds (AED 200M+ for Master File). Country-by-Country Reporting kicks in at AED 3.15B.",
  ],
  "Free Zones": [
    "Qualifying Free Zone Persons can benefit from a 0% corporate tax rate on qualifying income. The conditions: maintain adequate substance in the free zone, earn only qualifying income, and not elect otherwise.",
    "Qualifying income is essentially income from transactions with other Free Zone Persons, or income from exports. Domestic sales (to the UAE mainland) above de minimis thresholds are taxed at 9%.",
    "To stay qualified, the entity must earn qualifying income OR elect to be taxed at the standard 9% rate across all income. The election is irrevocable for 5 years.",
  ],
  Excise: [
    "Excise tax in the UAE applies to specific goods at the point of import or release from an excise warehouse. Carbonated beverages: 50%. Tobacco products: 100%. Energy drinks: 100%. Sugar-sweetened beverages: 50%.",
    "Excise goods are tracked through an excise warehouse regime. Goods in a designated excise warehouse can move without triggering the tax until released for consumption.",
    "For business owners, excise is generally a pass-through — you buy excise-paid from the importer. Your pricing and VAT return flow stay the same.",
  ],
  "Transfer Pricing": [
    "Transfer pricing documentation in the UAE follows the OECD guidelines, with a Master File, Local File, and CbCR structure aligned to the Federal Tax Authority's requirements.",
    "The threshold for Master File is AED 200 million in revenue or group revenue. Local File is required for related-party transactions crossing AED 4 million in either direction.",
    "Substance matters — the FTA will look at whether the UAE entity has the people, premises, and decision-making to justify the profits booked here.",
  ],
};

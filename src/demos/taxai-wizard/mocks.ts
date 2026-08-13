// src/demos/taxai-wizard/mocks.ts
//
// Synthetic fixtures for TaxAI Wizard. All names, emails, plan data are
// invented for the demo. No production code or schemas reused.

export interface Plan {
  id: "trial" | "monthly" | "quarterly" | "yearly";
  name: string;
  priceUsd: number;
  interval: "14 days" | "month" | "quarter" | "year";
  messageQuota: number;
  features: string[];
  highlighted?: boolean;
}

export interface Subscription {
  planId: Plan["id"];
  startedAt: string;
  expiresAt: string;
  messagesUsed: number;
}

export interface User {
  name: string;
  email: string;
  jobTitle: string;
  country: string;
}

export const PLANS: Plan[] = [
  {
    id: "trial",
    name: "Free Trial",
    priceUsd: 0,
    interval: "14 days",
    messageQuota: 50,
    features: ["50 messages", "GPT-4o tax Q&A", "Document upload (3 MB)", "Email support"],
  },
  {
    id: "monthly",
    name: "Monthly",
    priceUsd: 99,
    interval: "month",
    messageQuota: 100,
    features: ["100 messages / month", "GPT-4o tax Q&A", "Document upload (10 MB)", "Priority support"],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    priceUsd: 250,
    interval: "quarter",
    messageQuota: 300,
    features: ["300 messages / quarter", "GPT-4o tax Q&A", "Document upload (25 MB)", "Priority support", "Tax calendar reminders"],
    highlighted: true,
  },
  {
    id: "yearly",
    name: "Yearly",
    priceUsd: 899,
    interval: "year",
    messageQuota: 1200,
    features: ["1,200 messages / year", "GPT-4o tax Q&A", "Document upload (unlimited)", "Dedicated CSM", "Custom tax prompts"],
  },
];

export const SAMPLE_USER: User = {
  name: "Sara Al-Mansouri",
  email: "sara.mansouri@example.ae",
  jobTitle: "Freelance Tax Consultant",
  country: "United Arab Emirates",
};

export const SAMPLE_SUBSCRIPTION: Subscription = {
  planId: "quarterly",
  startedAt: "2026-07-15",
  expiresAt: "2026-10-15",
  messagesUsed: 87,
};

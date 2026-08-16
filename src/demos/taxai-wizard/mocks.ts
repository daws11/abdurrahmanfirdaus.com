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
  description: string;
  highlighted?: boolean;
  /** Trial plans skip Checkout → jump directly to Success. */
  isTrial?: boolean;
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
    messageQuota: 10,
    description: "Try all features for 14 days",
    features: [
      "Up to 10 messages",
      "No credit card required",
      "1 user",
      "1 device",
      "Bilingual support (EN/AR)",
    ],
    isTrial: true,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    priceUsd: 99,
    interval: "month",
    messageQuota: 100,
    description: "Ideal for business owners, freelancers, tax advisors, accountants, and finance professionals.",
    features: [
      "100 AI-powered messages per month",
      "UAE Tax Coverage (VAT/Corporate/Excise)",
      "Priority email support",
      "1 user",
      "1 device",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    priceUsd: 250,
    interval: "quarter",
    messageQuota: 300,
    description: "Best for professionals who want consistent tax advisory access with savings.",
    features: [
      "300 messages total over 3 months",
      "Standard support",
      "1-2 users",
      "2 devices",
      "Monthly tax digest",
    ],
    highlighted: true,
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    priceUsd: 899,
    interval: "year",
    messageQuota: 1200,
    description: "For users committed to long-term support and deeper features, with the best value.",
    features: [
      "1,200 messages per year (averaging 100/month)",
      "Priority email support",
      "Early access to new features",
      "Onboarding session included",
      "3+ users",
      "3 devices",
    ],
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

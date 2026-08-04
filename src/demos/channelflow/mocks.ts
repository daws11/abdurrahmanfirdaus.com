// src/demos/channelflow/mocks.ts
//
// Synthetic fixtures for the Channelflow demo. All names, IDs, and codes are
// generic placeholders (Guest 01, BK-0001, TG-01, etc.). Channel labels
// (WhatsApp / Instagram / Email / TikTok) are public product names used as
// category labels only — never as config or secrets.
//
// Scale matches the production app qualitatively: 50 conversations across
// 4 channels, ~30 bookings, 8 tour guides, and 25 commission-eligible
// entries (groups of 6+ with an assigned guide).

import type { Channel } from "@/demos/_shared/fixtures/bookings";

// ---------- Channel & thread vocabulary ----------

export type ChannelKey = Channel;
export const CHANNELS: { key: ChannelKey; label: string; color: string }[] = [
  { key: "whatsapp", label: "WhatsApp", color: "var(--accent)" },
  { key: "instagram", label: "Instagram DM", color: "var(--channel-ig)" },
  { key: "email", label: "Email", color: "var(--channel-email)" },
  { key: "tiktok", label: "TikTok", color: "var(--channel-tiktok)" },
];

export function channelColor(c: ChannelKey): string {
  switch (c) {
    case "whatsapp":
      return "var(--accent)";
    case "instagram":
      return "var(--channel-ig)";
    case "email":
      return "var(--channel-email)";
    case "tiktok":
      return "var(--channel-tiktok)";
  }
}

export function channelBgClass(c: ChannelKey): string {
  // Tailwind class for the channel's solid background (used on the avatar tile).
  switch (c) {
    case "whatsapp":
      return "bg-emerald-500";
    case "instagram":
      return "bg-violet-500";
    case "email":
      return "bg-sky-500";
    case "tiktok":
      return "bg-slate-700";
  }
}

export function channelLabel(c: ChannelKey): string {
  return CHANNELS.find((x) => x.key === c)?.label ?? c;
}

// ---------- Tour guides ----------

export interface TourGuide {
  code: string;
  name: string;
  joinedAt: string;
}

export const TOUR_GUIDES: TourGuide[] = [
  { code: "TG-01", name: "Guide 01", joinedAt: "2025-01-04" },
  { code: "TG-02", name: "Guide 02", joinedAt: "2025-02-12" },
  { code: "TG-03", name: "Guide 03", joinedAt: "2025-04-22" },
  { code: "TG-04", name: "Guide 04", joinedAt: "2025-09-08" },
  { code: "TG-05", name: "Guide 05", joinedAt: "2026-01-19" },
  { code: "TG-06", name: "Guide 06", joinedAt: "2026-02-28" },
  { code: "TG-07", name: "Guide 07", joinedAt: "2026-04-11" },
  { code: "TG-08", name: "Guide 08", joinedAt: "2026-06-15" },
];

// ---------- Threads (the inbox) ----------

export type ThreadStatus = "new" | "interested" | "awaiting-deposit" | "booked" | "lost";
export type Intent = "booking" | "reschedule" | "cancel" | "info";

export interface Thread {
  id: string;
  channel: ChannelKey;
  guestName: string;
  /** Last inbound message preview. */
  preview: string;
  /** ISO timestamp of the most recent message. */
  lastAt: string;
  status: ThreadStatus;
  intent: Intent;
  partySize?: number;
  /** ISO date for the requested tour date. */
  tourDate?: string;
  /** Optional tour guide code if a guide is on the booking. */
  tourGuideCode?: string;
  /** Per-booking value in IDR; used to calculate guide commission. */
  bookingValue?: number;
  unread?: boolean;
  /** Optional destination tag, e.g. "Ubud", "Nusa Penida". */
  destination?: string;
  /** Optional preferred slot ("morning" | "afternoon" | "sunset"). */
  slot?: "morning" | "afternoon" | "sunset";
}

const NOW = "2026-08-03T09:00:00Z";

// 50 conversations. Channels roughly match production mix; statuses progress
// from "new" through "booked" or "lost". Booking value scales with party size.
const BASE_VALUE_PER_GUEST = 300_000; // IDR

function bookingValueFor(party: number | undefined): number | undefined {
  if (!party) return undefined;
  return party * BASE_VALUE_PER_GUEST;
}

export const THREADS: Thread[] = [
  // ── 1–10: WhatsApp, mostly new & interested ──────────────────────────────
  {
    id: "TH-0001",
    channel: "whatsapp",
    guestName: "Guest 01",
    preview: "Hi! Is Saturday morning still open for 8 people?",
    lastAt: "2026-08-03T08:42:00Z",
    status: "interested",
    intent: "booking",
    partySize: 8,
    tourDate: "2026-08-09",
    tourGuideCode: "TG-01",
    bookingValue: bookingValueFor(8),
    destination: "Ubud",
    slot: "morning",
    unread: true,
  },
  {
    id: "TH-0002",
    channel: "instagram",
    guestName: "Guest 02",
    preview: "Saw your story — do you have spots for 4 on Aug 14?",
    lastAt: "2026-08-03T07:55:00Z",
    status: "new",
    intent: "booking",
    partySize: 4,
    tourDate: "2026-08-14",
    destination: "Nusa Penida",
    unread: true,
  },
  {
    id: "TH-0003",
    channel: "email",
    guestName: "Guest 03",
    preview: "Re-sending deposit slip. Can you confirm once received?",
    lastAt: "2026-08-02T22:11:00Z",
    status: "awaiting-deposit",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-07",
    tourGuideCode: "TG-02",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
  },
  {
    id: "TH-0004",
    channel: "tiktok",
    guestName: "Guest 04",
    preview: "loved the video! can we book 10 ppl for the 21st?",
    lastAt: "2026-08-02T18:24:00Z",
    status: "interested",
    intent: "booking",
    partySize: 10,
    tourDate: "2026-08-21",
    tourGuideCode: "TG-03",
    bookingValue: bookingValueFor(10),
    destination: "Nusa Penida",
    slot: "afternoon",
  },
  {
    id: "TH-0005",
    channel: "whatsapp",
    guestName: "Guest 05",
    preview: "Confirmed for 6 on Aug 10 — thank you!",
    lastAt: "2026-08-02T16:02:00Z",
    status: "booked",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-10",
    tourGuideCode: "TG-02",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
    slot: "morning",
  },
  {
    id: "TH-0006",
    channel: "email",
    guestName: "Guest 06",
    preview: "We need to push our booking from Aug 5 to Aug 12.",
    lastAt: "2026-08-02T11:38:00Z",
    status: "interested",
    intent: "reschedule",
    partySize: 5,
    tourDate: "2026-08-12",
    destination: "Ubud",
  },
  {
    id: "TH-0007",
    channel: "instagram",
    guestName: "Guest 07",
    preview: "Sorry — plans changed. Please cancel our booking.",
    lastAt: "2026-08-01T20:14:00Z",
    status: "lost",
    intent: "cancel",
    partySize: 4,
    tourDate: "2026-08-06",
    destination: "Nusa Penida",
  },
  {
    id: "TH-0008",
    channel: "whatsapp",
    guestName: "Guest 08",
    preview: "Is pickup from Ubud included? What time does it start?",
    lastAt: "2026-08-01T15:45:00Z",
    status: "interested",
    intent: "info",
    partySize: 12,
    tourDate: "2026-08-19",
    tourGuideCode: "TG-04",
    bookingValue: bookingValueFor(12),
    destination: "Nusa Penida",
    slot: "sunset",
  },
  {
    id: "TH-0009",
    channel: "whatsapp",
    guestName: "Guest 09",
    preview: "Deposit received. See you on the 8th!",
    lastAt: "2026-08-01T10:00:00Z",
    status: "booked",
    intent: "booking",
    partySize: 9,
    tourDate: "2026-08-08",
    tourGuideCode: "TG-01",
    bookingValue: bookingValueFor(9),
    destination: "Ubud",
    slot: "afternoon",
  },
  {
    id: "TH-0010",
    channel: "tiktok",
    guestName: "Guest 10",
    preview: "Can we get a discount for 15 people?",
    lastAt: "2026-07-31T22:50:00Z",
    status: "new",
    intent: "booking",
    partySize: 15,
    tourDate: "2026-08-23",
    destination: "Nusa Penida",
    unread: true,
  },
  // ── 11–20: Mixed channels, mid-week inquiries ────────────────────────────
  {
    id: "TH-0011",
    channel: "whatsapp",
    guestName: "Guest 11",
    preview: "What's the rain policy for the sunset slot?",
    lastAt: "2026-08-03T06:20:00Z",
    status: "interested",
    intent: "info",
    partySize: 4,
    tourDate: "2026-08-15",
    destination: "Uluwatu",
    unread: true,
  },
  {
    id: "TH-0012",
    channel: "whatsapp",
    guestName: "Guest 12",
    preview: "Hi! Can you do 7 ppl on the 12th at 2pm?",
    lastAt: "2026-08-02T19:33:00Z",
    status: "interested",
    intent: "booking",
    partySize: 7,
    tourDate: "2026-08-12",
    tourGuideCode: "TG-05",
    bookingValue: bookingValueFor(7),
    destination: "Ubud",
    slot: "afternoon",
  },
  {
    id: "TH-0013",
    channel: "instagram",
    guestName: "Guest 13",
    preview: "Just paid! Looking forward to the trip 🙌",
    lastAt: "2026-08-02T17:08:00Z",
    status: "booked",
    intent: "booking",
    partySize: 11,
    tourDate: "2026-08-11",
    tourGuideCode: "TG-03",
    bookingValue: bookingValueFor(11),
    destination: "Nusa Penida",
    slot: "morning",
  },
  {
    id: "TH-0014",
    channel: "email",
    guestName: "Guest 14",
    preview: "Can I get the full price breakdown for 8 people?",
    lastAt: "2026-08-02T14:12:00Z",
    status: "new",
    intent: "info",
    partySize: 8,
    tourDate: "2026-08-22",
    destination: "Ubud",
  },
  {
    id: "TH-0015",
    channel: "whatsapp",
    guestName: "Guest 15",
    preview: "We have 6 coming. Deposit sent just now.",
    lastAt: "2026-08-02T12:55:00Z",
    status: "booked",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-16",
    tourGuideCode: "TG-06",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
  },
  {
    id: "TH-0016",
    channel: "instagram",
    guestName: "Guest 16",
    preview: "Can I add 2 more people to my booking on Aug 11?",
    lastAt: "2026-08-02T10:42:00Z",
    status: "interested",
    intent: "booking",
    partySize: 13,
    tourDate: "2026-08-11",
    tourGuideCode: "TG-03",
    bookingValue: bookingValueFor(13),
    destination: "Nusa Penida",
  },
  {
    id: "TH-0017",
    channel: "tiktok",
    guestName: "Guest 17",
    preview: "hi! is Aug 17 morning free for 5 people?",
    lastAt: "2026-08-01T22:18:00Z",
    status: "new",
    intent: "booking",
    partySize: 5,
    tourDate: "2026-08-17",
    destination: "Ubud",
  },
  {
    id: "TH-0018",
    channel: "whatsapp",
    guestName: "Guest 18",
    preview: "Sorry, we can't make it on the 14th. Cancel please.",
    lastAt: "2026-08-01T16:30:00Z",
    status: "lost",
    intent: "cancel",
    partySize: 6,
    tourDate: "2026-08-14",
    destination: "Uluwatu",
  },
  {
    id: "TH-0019",
    channel: "email",
    guestName: "Guest 19",
    preview: "Booking confirmation for 9 on Aug 20 — please confirm.",
    lastAt: "2026-08-01T11:05:00Z",
    status: "booked",
    intent: "booking",
    partySize: 9,
    tourDate: "2026-08-20",
    tourGuideCode: "TG-04",
    bookingValue: bookingValueFor(9),
    destination: "Nusa Penida",
    slot: "sunset",
  },
  {
    id: "TH-0020",
    channel: "instagram",
    guestName: "Guest 20",
    preview: "Hi! Group of 8, weekend trip. Best option for Aug 16-17?",
    lastAt: "2026-07-31T19:48:00Z",
    status: "new",
    intent: "booking",
    partySize: 8,
    tourDate: "2026-08-16",
    destination: "Ubud",
  },
  // ── 21–30: End-of-week inquiries ─────────────────────────────────────────
  {
    id: "TH-0021",
    channel: "whatsapp",
    guestName: "Guest 21",
    preview: "Quick one — can we do pickup from Canggu for 6?",
    lastAt: "2026-08-03T05:55:00Z",
    status: "interested",
    intent: "info",
    partySize: 6,
    tourDate: "2026-08-18",
    tourGuideCode: "TG-07",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
    unread: true,
  },
  {
    id: "TH-0022",
    channel: "whatsapp",
    guestName: "Guest 22",
    preview: "We'd like the sunset slot. 10 ppl on the 22nd.",
    lastAt: "2026-08-02T20:14:00Z",
    status: "interested",
    intent: "booking",
    partySize: 10,
    tourDate: "2026-08-22",
    tourGuideCode: "TG-05",
    bookingValue: bookingValueFor(10),
    destination: "Uluwatu",
    slot: "sunset",
  },
  {
    id: "TH-0023",
    channel: "instagram",
    guestName: "Guest 23",
    preview: "Are kids under 5 free? We have 3 adults + 2 kids.",
    lastAt: "2026-08-02T15:39:00Z",
    status: "new",
    intent: "info",
    partySize: 5,
    tourDate: "2026-08-24",
    destination: "Ubud",
  },
  {
    id: "TH-0024",
    channel: "email",
    guestName: "Guest 24",
    preview: "Need invoice for our company retreat. 14 ppl, Aug 18.",
    lastAt: "2026-08-02T13:20:00Z",
    status: "interested",
    intent: "booking",
    partySize: 14,
    tourDate: "2026-08-18",
    tourGuideCode: "TG-08",
    bookingValue: bookingValueFor(14),
    destination: "Nusa Penida",
    slot: "morning",
  },
  {
    id: "TH-0025",
    channel: "whatsapp",
    guestName: "Guest 25",
    preview: "Deposit sent! 6 on Aug 25, morning slot.",
    lastAt: "2026-08-02T09:11:00Z",
    status: "awaiting-deposit",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-25",
    tourGuideCode: "TG-07",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
  },
  {
    id: "TH-0026",
    channel: "tiktok",
    guestName: "Guest 26",
    preview: "do you have any discount for 4 people? weekend?",
    lastAt: "2026-08-01T23:42:00Z",
    status: "new",
    intent: "info",
    partySize: 4,
    tourDate: "2026-08-17",
    destination: "Ubud",
  },
  {
    id: "TH-0027",
    channel: "whatsapp",
    guestName: "Guest 27",
    preview: "Loved the trip! Can we book again for Aug 28, 7 ppl?",
    lastAt: "2026-08-01T18:25:00Z",
    status: "interested",
    intent: "booking",
    partySize: 7,
    tourDate: "2026-08-28",
    tourGuideCode: "TG-06",
    bookingValue: bookingValueFor(7),
    destination: "Nusa Penida",
    slot: "afternoon",
  },
  {
    id: "TH-0028",
    channel: "instagram",
    guestName: "Guest 28",
    preview: "All confirmed! See you on the 17th. Thanks!",
    lastAt: "2026-08-01T14:08:00Z",
    status: "booked",
    intent: "booking",
    partySize: 8,
    tourDate: "2026-08-17",
    tourGuideCode: "TG-08",
    bookingValue: bookingValueFor(8),
    destination: "Ubud",
    slot: "morning",
  },
  {
    id: "TH-0029",
    channel: "email",
    guestName: "Guest 29",
    preview: "Reached out on Aug 1. Awaiting confirmation for 6 on Aug 26.",
    lastAt: "2026-08-01T09:30:00Z",
    status: "booked",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-26",
    tourGuideCode: "TG-07",
    bookingValue: bookingValueFor(6),
    destination: "Uluwatu",
  },
  {
    id: "TH-0030",
    channel: "whatsapp",
    guestName: "Guest 30",
    preview: "Hi! Booking 8 ppl for sunset Aug 30. Available?",
    lastAt: "2026-07-31T21:11:00Z",
    status: "new",
    intent: "booking",
    partySize: 8,
    tourDate: "2026-08-30",
    destination: "Uluwatu",
    slot: "sunset",
  },
  // ── 31–40: Late-July drop-offs, recent active ────────────────────────────
  {
    id: "TH-0031",
    channel: "whatsapp",
    guestName: "Guest 31",
    preview: "Hi! Are there any spots left for 4 on Aug 13?",
    lastAt: "2026-07-31T17:50:00Z",
    status: "interested",
    intent: "booking",
    partySize: 4,
    tourDate: "2026-08-13",
    destination: "Ubud",
  },
  {
    id: "TH-0032",
    channel: "instagram",
    guestName: "Guest 32",
    preview: "thanks! booked and paid for Aug 19 — 6 ppl 🙌",
    lastAt: "2026-07-31T15:22:00Z",
    status: "booked",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-19",
    tourGuideCode: "TG-04",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
    slot: "morning",
  },
  {
    id: "TH-0033",
    channel: "tiktok",
    guestName: "Guest 33",
    preview: "saw your latest vid! 9 ppl on Aug 27 morning?",
    lastAt: "2026-07-31T13:08:00Z",
    status: "new",
    intent: "booking",
    partySize: 9,
    tourDate: "2026-08-27",
    destination: "Nusa Penida",
    slot: "morning",
  },
  {
    id: "TH-0034",
    channel: "whatsapp",
    guestName: "Guest 34",
    preview: "Confirmed 6 on Aug 21. Send the deposit link please.",
    lastAt: "2026-07-30T22:14:00Z",
    status: "booked",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-21",
    tourGuideCode: "TG-05",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
  },
  {
    id: "TH-0035",
    channel: "email",
    guestName: "Guest 35",
    preview: "Hi — 11 ppl on Aug 25. Need full package quote.",
    lastAt: "2026-07-30T19:42:00Z",
    status: "interested",
    intent: "booking",
    partySize: 11,
    tourDate: "2026-08-25",
    tourGuideCode: "TG-08",
    bookingValue: bookingValueFor(11),
    destination: "Nusa Penida",
    slot: "afternoon",
  },
  {
    id: "TH-0036",
    channel: "instagram",
    guestName: "Guest 36",
    preview: "Hi! Can we get a quote for 10 ppl on Aug 28?",
    lastAt: "2026-07-30T16:18:00Z",
    status: "new",
    intent: "info",
    partySize: 10,
    tourDate: "2026-08-28",
    destination: "Ubud",
  },
  {
    id: "TH-0037",
    channel: "whatsapp",
    guestName: "Guest 37",
    preview: "Cancel my booking on Aug 11 please. Thanks.",
    lastAt: "2026-07-30T12:00:00Z",
    status: "lost",
    intent: "cancel",
    partySize: 4,
    tourDate: "2026-08-11",
    destination: "Ubud",
  },
  {
    id: "TH-0038",
    channel: "whatsapp",
    guestName: "Guest 38",
    preview: "8 people for Aug 23 morning. Want to confirm and pay.",
    lastAt: "2026-07-30T09:48:00Z",
    status: "interested",
    intent: "booking",
    partySize: 8,
    tourDate: "2026-08-23",
    tourGuideCode: "TG-06",
    bookingValue: bookingValueFor(8),
    destination: "Ubud",
    slot: "morning",
  },
  {
    id: "TH-0039",
    channel: "tiktok",
    guestName: "Guest 39",
    preview: "hi!! is 6 ppl sunset on Aug 24 possible?",
    lastAt: "2026-07-29T22:35:00Z",
    status: "new",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-24",
    destination: "Uluwatu",
    slot: "sunset",
  },
  {
    id: "TH-0040",
    channel: "email",
    guestName: "Guest 40",
    preview: "Reschedule request — 7 ppl from Aug 9 to Aug 16.",
    lastAt: "2026-07-29T19:10:00Z",
    status: "interested",
    intent: "reschedule",
    partySize: 7,
    tourDate: "2026-08-16",
    tourGuideCode: "TG-07",
    bookingValue: bookingValueFor(7),
    destination: "Nusa Penida",
  },
  // ── 41–50: Two-week-out leads, last-7-day inquiries ──────────────────────
  {
    id: "TH-0041",
    channel: "whatsapp",
    guestName: "Guest 41",
    preview: "What's the early-bird price for 6 on Aug 31?",
    lastAt: "2026-07-29T15:55:00Z",
    status: "interested",
    intent: "info",
    partySize: 6,
    tourDate: "2026-08-31",
    destination: "Ubud",
  },
  {
    id: "TH-0042",
    channel: "instagram",
    guestName: "Guest 42",
    preview: "Deposit sent! 8 ppl on Aug 27. See you!",
    lastAt: "2026-07-29T13:20:00Z",
    status: "booked",
    intent: "booking",
    partySize: 8,
    tourDate: "2026-08-27",
    tourGuideCode: "TG-04",
    bookingValue: bookingValueFor(8),
    destination: "Nusa Penida",
    slot: "afternoon",
  },
  {
    id: "TH-0043",
    channel: "whatsapp",
    guestName: "Guest 43",
    preview: "Loved the trip last year! 10 ppl Aug 28 afternoon?",
    lastAt: "2026-07-29T10:42:00Z",
    status: "interested",
    intent: "booking",
    partySize: 10,
    tourDate: "2026-08-28",
    tourGuideCode: "TG-08",
    bookingValue: bookingValueFor(10),
    destination: "Ubud",
    slot: "afternoon",
  },
  {
    id: "TH-0044",
    channel: "email",
    guestName: "Guest 44",
    preview: "Invoice needed for 12 ppl, Aug 22, Nusa Penida.",
    lastAt: "2026-07-28T20:08:00Z",
    status: "interested",
    intent: "booking",
    partySize: 12,
    tourDate: "2026-08-22",
    tourGuideCode: "TG-05",
    bookingValue: bookingValueFor(12),
    destination: "Nusa Penida",
    slot: "morning",
  },
  {
    id: "TH-0045",
    channel: "tiktok",
    guestName: "Guest 45",
    preview: "saw the reef vid! 6 ppl Aug 29?",
    lastAt: "2026-07-28T17:30:00Z",
    status: "new",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-29",
    destination: "Nusa Penida",
  },
  {
    id: "TH-0046",
    channel: "whatsapp",
    guestName: "Guest 46",
    preview: "Hi — 9 ppl Aug 26, deposit sent. Please confirm.",
    lastAt: "2026-07-28T14:55:00Z",
    status: "booked",
    intent: "booking",
    partySize: 9,
    tourDate: "2026-08-26",
    tourGuideCode: "TG-06",
    bookingValue: bookingValueFor(9),
    destination: "Ubud",
    slot: "morning",
  },
  {
    id: "TH-0047",
    channel: "instagram",
    guestName: "Guest 47",
    preview: "Confirming 7 ppl on Aug 30. Pay link please?",
    lastAt: "2026-07-28T11:12:00Z",
    status: "interested",
    intent: "booking",
    partySize: 7,
    tourDate: "2026-08-30",
    tourGuideCode: "TG-07",
    bookingValue: bookingValueFor(7),
    destination: "Uluwatu",
    slot: "sunset",
  },
  {
    id: "TH-0048",
    channel: "whatsapp",
    guestName: "Guest 48",
    preview: "All booked for 11 ppl Aug 31! See you then!",
    lastAt: "2026-07-27T19:48:00Z",
    status: "booked",
    intent: "booking",
    partySize: 11,
    tourDate: "2026-08-31",
    tourGuideCode: "TG-08",
    bookingValue: bookingValueFor(11),
    destination: "Nusa Penida",
    slot: "afternoon",
  },
  {
    id: "TH-0049",
    channel: "email",
    guestName: "Guest 49",
    preview: "Need to reschedule 6 ppl from Aug 8 to Aug 15.",
    lastAt: "2026-07-27T16:25:00Z",
    status: "interested",
    intent: "reschedule",
    partySize: 6,
    tourDate: "2026-08-15",
    tourGuideCode: "TG-03",
    bookingValue: bookingValueFor(6),
    destination: "Ubud",
  },
  {
    id: "TH-0050",
    channel: "whatsapp",
    guestName: "Guest 50",
    preview: "Hi! Last-minute — 6 ppl on Aug 11 afternoon possible?",
    lastAt: "2026-07-27T12:08:00Z",
    status: "new",
    intent: "booking",
    partySize: 6,
    tourDate: "2026-08-11",
    destination: "Ubud",
    slot: "afternoon",
  },
];

// ---------- Conversation messages (per thread) ----------

export interface ChatMessage {
  id?: string;
  from: "guest" | "agent";
  body: string;
  at: string;
}

// Programmatically expand messages per thread so each thread has a realistic
// 2-6 message transcript. Branches on status / intent / party size.
function buildTranscript(t: Thread): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  let t0 = new Date(t.lastAt).getTime() - 1000 * 60 * 60 * 24 * 2; // ~2 days earlier
  const step = (mins: number) => {
    const at = new Date(t0).toISOString();
    t0 += mins * 60_000;
    return at;
  };
  const guest = (body: string) => ({ from: "guest" as const, body, at: step(15) });
  const agent = (body: string) => ({ from: "agent" as const, body, at: step(10) });

  const party = t.partySize ? `${t.partySize} ${t.partySize === 1 ? "person" : "people"}` : "a small group";
  const date = t.tourDate ?? "TBD";
  const dest = t.destination ?? "the trip";
  const guide = t.tourGuideCode ? ` your assigned guide is ${t.tourGuideCode}.` : "";

  // Opening — always a guest message.
  if (t.intent === "booking") {
    msgs.push(
      guest(
        `Hi! I'm looking to book ${party} for ${dest} on ${date}. Is that still available?`,
      ),
    );
  } else if (t.intent === "reschedule") {
    msgs.push(
      guest(
        `Hi — we need to move our booking for ${party} to a later date. Can you help?`,
      ),
    );
  } else if (t.intent === "cancel") {
    msgs.push(guest(`Hi, we need to cancel our ${party} booking. Sorry for the short notice.`));
  } else {
    msgs.push(guest(`Hi! Quick question about ${dest} for ${party} on ${date}.`));
  }

  // Agent acknowledgement if status is not "new".
  if (t.status !== "new") {
    if (t.intent === "booking") {
      msgs.push(
        agent(
          `Hi ${t.guestName}! ${date} ${t.slot ? `(${t.slot})` : ""} is open for ${party}. Want me to hold it?`,
        ),
      );
    } else if (t.intent === "reschedule") {
      msgs.push(agent(`Hi ${t.guestName} — happy to help move the booking. What date works?`));
    } else if (t.intent === "cancel") {
      msgs.push(
        agent(
          `No problem, ${t.guestName}. Cancelling now — let me know if anything changes.`,
        ),
      );
    } else {
      msgs.push(agent(`Hi ${t.guestName}! Sure, what would you like to know about ${dest}?`));
    }
  }

  // Mid-thread — conditional on status progression.
  if (
    t.status === "interested" ||
    t.status === "awaiting-deposit" ||
    t.status === "booked"
  ) {
    if (t.intent === "booking") {
      msgs.push(
        guest(
          t.partySize && t.partySize >= 10
            ? `Yes please, and we'll need a guide for the group.`
            : `Yes, please hold. Let me know about the deposit.`,
        ),
      );
      msgs.push(
        agent(
          `Sending the deposit link now.${guide} Once it clears the booking is confirmed.`,
        ),
      );
    } else if (t.intent === "reschedule") {
      msgs.push(guest(`Could we move to ${date}?`));
      msgs.push(agent(`Done — moved to ${date}.`));
    } else if (t.intent === "info") {
      msgs.push(guest(`What's the cancellation policy?`));
      msgs.push(
        agent(
          `Free cancellation up to 48h before. After that 50% charge.${guide}`,
        ),
      );
    }
  }

  // Awaiting-deposit / booked: confirm payment
  if (t.status === "awaiting-deposit") {
    msgs.push(
      guest(`Re-sending the deposit slip — can you confirm once received?`),
    );
  } else if (t.status === "booked") {
    msgs.push(guest(`Deposit received. See you on the ${date.slice(-2)}nd!`));
    msgs.push(
      agent(
        `Confirmed! Your guide ${t.tourGuideCode} will reach out the day before with pickup details.`,
      ),
    );
  } else if (t.status === "lost") {
    if (t.intent === "cancel") {
      msgs.push(agent(`Booking cancelled. No charge — refund if needed takes 3-5 days.`));
    } else {
      msgs.push(agent(`No problem — let me know if you change your mind.`));
    }
  }

  return msgs;
}

const MESSAGES_RAW: Record<string, ChatMessage[]> = Object.fromEntries(
  THREADS.map((t) => [t.id, buildTranscript(t)]),
);

// Export the raw transcripts; the last message in each transcript already uses
// the thread's `lastAt`, so the open-thread preview matches the transcript tail.
export const MESSAGES: Record<string, ChatMessage[]> = MESSAGES_RAW;

// ---------- Bookings (consolidated, derived) ----------

export interface Booking {
  id: string;
  channel: ChannelKey;
  guestName: string;
  tourDate: string;
  partySize: number;
  status: "new" | "confirmed" | "cancelled";
  tourGuideCode?: string;
  bookingValue: number;
  destination?: string;
  slot?: "morning" | "afternoon" | "sunset";
}

export const BOOKINGS: Booking[] = THREADS.filter(
  (t) => t.status === "booked" || t.status === "awaiting-deposit" || t.status === "interested",
).map((t, idx) => ({
  id: `BK-${String(idx + 1).padStart(4, "0")}`,
  channel: t.channel,
  guestName: t.guestName,
  tourDate: t.tourDate ?? "",
  partySize: t.partySize ?? 0,
  status: t.status === "booked" ? "confirmed" : t.status === "lost" ? "cancelled" : "new",
  tourGuideCode: t.tourGuideCode,
  bookingValue: t.bookingValue ?? 0,
  destination: t.destination,
  slot: t.slot,
}));

// ---------- Commission ledger (tour guide) ----------

export interface CommissionRow {
  id: string;
  tourGuideCode: string;
  bookingId: string;
  guestName: string;
  tourDate: string;
  partySize: number;
  /** Total booking value in IDR. */
  bookingValue: number;
  /** Commission rate (0 for groups < 6, 0.10 for groups ≥ 6). */
  rate: number;
  /** Computed commission in IDR. */
  commission: number;
}

const RATE_THRESHOLD = 6;
const GUIDE_RATE = 0.1;

export const COMMISSION_LEDGER: CommissionRow[] = BOOKINGS.filter(
  (b) => b.tourGuideCode && b.partySize >= RATE_THRESHOLD && b.status === "confirmed",
).map((b, idx) => ({
  id: `CM-${String(idx + 1).padStart(4, "0")}`,
  tourGuideCode: b.tourGuideCode as string,
  bookingId: b.id,
  guestName: b.guestName,
  tourDate: b.tourDate,
  partySize: b.partySize,
  bookingValue: b.bookingValue,
  rate: GUIDE_RATE,
  commission: Math.round(b.bookingValue * GUIDE_RATE),
}));

// Aggregated guide totals (sum of confirmed commissions per guide).
export interface GuideTotal {
  tourGuideCode: string;
  bookings: number;
  guests: number;
  revenue: number;
  commission: number;
}

export const GUIDE_TOTALS: GuideTotal[] = TOUR_GUIDES.map((g) => {
  const rows = COMMISSION_LEDGER.filter((r) => r.tourGuideCode === g.code);
  return {
    tourGuideCode: g.code,
    bookings: rows.length,
    guests: rows.reduce((s, r) => s + r.partySize, 0),
    revenue: rows.reduce((s, r) => s + r.bookingValue, 0),
    commission: rows.reduce((s, r) => s + r.commission, 0),
  };
});

// ---------- Analytics summary ----------

export interface ChannelSummary {
  channel: ChannelKey;
  open: number;
  booked: number;
  conversion: number; // 0..1
}

export const CHANNEL_SUMMARY: ChannelSummary[] = CHANNELS.map((c) => {
  const rows = THREADS.filter((t) => t.channel === c.key);
  const booked = rows.filter((t) => t.status === "booked").length;
  return {
    channel: c.key,
    open: rows.length,
    booked,
    conversion: rows.length ? booked / rows.length : 0,
  };
});

const TODAY = "2026-08-03";
const NEXT_WEEK_END = "2026-08-10";

export const ANALYTICS = {
  totalThreads: THREADS.length,
  unread: THREADS.filter((t) => t.unread).length,
  bookedThisWeek: THREADS.filter((t) => t.status === "booked").length,
  upcomingTours: BOOKINGS.filter(
    (b) => b.status === "confirmed" && b.tourDate >= TODAY,
  ).length,
  revenue: COMMISSION_LEDGER.reduce((s, r) => s + r.bookingValue, 0),
  commission: COMMISSION_LEDGER.reduce((s, r) => s + r.commission, 0),
};

// Export derived helpers used by screens
export { NOW, TODAY, NEXT_WEEK_END };

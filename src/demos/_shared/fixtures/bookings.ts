// src/demos/_shared/fixtures/bookings.ts
//
// Synthetic booking fixtures. Per-app plans extend with richer data.

export type Channel = "whatsapp" | "instagram" | "email" | "tiktok";
export interface Message { from: "guest" | "agent"; body: string; at: string; }
export interface Booking {
  id: string;
  channel: Channel;
  guestName: string;
  date: string;
  partySize: number;
  status: "new" | "confirmed" | "cancelled";
  tourGuideCode?: string;
  messages: Message[];
}
export const BOOKINGS: Booking[] = [];

// src/demos/_shared/fixtures/kitchen.ts
//
// Synthetic kitchen fixtures. Per-app plans extend with richer data.

export type PrepStatus = "pending" | "in-progress" | "done";
export interface PrepItem { id: string; name: string; outletId: string; parLevel: number; status: PrepStatus; }
export const PREP_ITEMS: PrepItem[] = [];

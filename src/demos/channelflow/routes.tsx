// src/demos/channelflow/routes.tsx
//
// Typed sub-routes for the Channelflow demo. URL shape:
//   #/demos/channelflow/queue      — default landing
//   #/demos/channelflow/bookings
//   #/demos/channelflow/commission
//   #/demos/channelflow/analytics
//
// The router in src/demos/router.tsx passes the parsed `sub` to the Channelflow
// component, which switches on it via `getScreenLabel` below.

export type ChannelflowScreen = "queue" | "bookings" | "commission" | "analytics";

export const CHANNELFLOW_SCREENS: {
  id: ChannelflowScreen;
  label: string;
}[] = [
  { id: "queue", label: "Inbox" },
  { id: "bookings", label: "Bookings" },
  { id: "commission", label: "Commission" },
  { id: "analytics", label: "Analytics" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: ChannelflowScreen,
): ChannelflowScreen {
  if (!sub) return fallback;
  const found = CHANNELFLOW_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as ChannelflowScreen;
}

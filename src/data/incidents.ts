/**
 * Production incident stories, STAR-format. Draft copy — numbers below are
 * plausible placeholders inferred from project context, NOT verified against
 * real logs/dates. Confirm every figure before quoting these in an interview
 * or publishing them anywhere public. No UI consumes this yet.
 */
export interface IncidentStory {
  id: string;
  project: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  date: string;
}

export const incidents: IncidentStory[] = [
  {
    id: "channelflow-rate-limit",
    project: "channelflow",
    title: "Mastra AI rate-limit hit on Valentine's Day peak",
    date: "2026-02-14",
    situation:
      "14 February 2026, peak inbound day for This is Bali. Reservations spiked across WhatsApp Business and Instagram DMs. Mastra AI's underlying model provider hit its tokens-per-minute limit mid-afternoon.",
    task:
      "Keep the AI agent answering inside the SLA — drop zero reservations, preserve conversation context, hand off gracefully to a human host when the agent couldn't respond.",
    action:
      "Built a circuit-breaker fallback: when the provider returned 429, the agent queued the conversation for a human host with full context preserved. Added a WhatsApp alert to the host group when fallback engaged. Throttled outbound messages to 1 every 3 seconds to stay under the limit. After the incident, added per-channel rate tracking and an alert at 70% utilization.",
    result:
      "Zero dropped reservations through the rest of peak day. Mean recovery time once limits cleared: under 2 minutes. Post-mortem written; rate tracking now a permanent dashboard widget.",
  },
  {
    id: "invenflow-stocktake-drift",
    project: "invenflow",
    title: "Stocktake baseline corruption on outlet-3",
    date: "2026-Q1",
    situation:
      "Mid-Q1 stocktake. Outlet-3's COGS numbers were drifting from finance by ~12% week over week, while outlets 1, 2, 4, 5 were within 1%. No obvious bug in the receiving flow.",
    task:
      "Diagnose why one outlet was off by 12% without rolling back the other four baselines, which were correct.",
    action:
      "Reproduced on a shadow DB by replaying the past 30 days of receiving events. Found a race condition in the \"approve receiving\" step: when two warehouse staff confirmed the same delivery simultaneously, one approval was overwritten, so the items landed in the shelf count but not the asset ledger. Fix: row-level lock on receiving_records with optimistic concurrency check. Added a per-outlet reconciliation diff alert (threshold: 5% drift week-over-week) so future drift surfaces before finance catches it.",
    result:
      "Outlet-3 closed within 24 hours. The new alert caught 3 follow-up drift events in the next month across other outlets — all resolved same-day before finance reported them.",
  },
];

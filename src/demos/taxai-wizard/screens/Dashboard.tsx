// src/demos/taxai-wizard/screens/Dashboard.tsx
//
// Post-payment dashboard: quota widget (messages used / total), subscription
// status card, and a "Next steps" hint.

import { Activity, Calendar, MessageSquare } from "lucide-react";
import { StatTile } from "@/demos/_shared/StatTile";
import { Badge } from "@/demos/_shared/Badge";
import { PLANS, SAMPLE_SUBSCRIPTION, SAMPLE_USER } from "../mocks";

export function Dashboard() {
  const plan = PLANS.find((p) => p.id === SAMPLE_SUBSCRIPTION.planId)!;
  const remaining = plan.messageQuota - SAMPLE_SUBSCRIPTION.messagesUsed;
  const pct = Math.round((SAMPLE_SUBSCRIPTION.messagesUsed / plan.messageQuota) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Welcome back
          </p>
          <h2 className="mt-0.5 text-2xl font-semibold tracking-tight">{SAMPLE_USER.name}</h2>
        </div>
        <Badge tone="ok">Active · {plan.name}</Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Messages used"
          value={`${SAMPLE_SUBSCRIPTION.messagesUsed} / ${plan.messageQuota}`}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatTile
          label="Remaining"
          value={remaining.toLocaleString()}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatTile
          label="Renews on"
          value={SAMPLE_SUBSCRIPTION.expiresAt}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div
        className="mt-6 rounded-lg border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-sm font-semibold">Usage this quarter</h3>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {pct}% of your {plan.messageQuota}-message quota used.
        </p>
      </div>

      <div
        className="mt-6 rounded-lg border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-sm font-semibold">Next steps</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span>
              Open <a className="font-medium underline" href="#/demos/taxai-chat">TaxAI Chat</a> to ask a tax question.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span>
              Try <a className="font-medium underline" href="#/demos/taxai-talk">TaxAI Talk</a> for voice-based tax queries.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

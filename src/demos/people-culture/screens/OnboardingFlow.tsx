// src/demos/people-culture/screens/OnboardingFlow.tsx
//
// 5-step onboarding wizard for a synthetic onboarding employee. The
// Stepper lists the steps on the left with a circular indicator and a
// task-count dot; the right panel shows the active step's tasks. Tasks
// can be marked done / pending / in-progress; "Send to next step"
// advances the wizard. The flow mirrors the production wizard shape
// (Offer → Paperwork → Uniform → Training → First shift).

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Calendar,
  ChevronRight,
  Lightbulb,
  MessageCircle,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { Stepper } from "@/demos/_shared/Stepper";
import { setDemoHash } from "@/demos/router";
import { findEmployee, ONBOARDING_FLOW } from "../mocks";
import type {
  OnboardingFlow as Flow,
  OnboardingStepId,
  TaskStatus,
} from "../mocks";

const STEP_IDS: OnboardingStepId[] = [
  "offer",
  "paperwork",
  "uniform",
  "training",
  "first-shift",
];

export function OnboardingFlow() {
  const employee = findEmployee(ONBOARDING_FLOW.employeeCode);

  // Local mutable copy of the flow so interactions feel real.
  const [flow, setFlow] = useState<Flow>(() => ({
    ...ONBOARDING_FLOW,
    steps: ONBOARDING_FLOW.steps.map((s) => ({
      ...s,
      tasks: s.tasks.map((t) => ({ ...t })),
    })),
  }));
  const activeStepId = STEP_IDS[flow.activeStepIndex] ?? "offer";

  const activeStep = flow.steps[flow.activeStepIndex];

  const summary = useMemo(() => {
    const counts = { pending: 0, "in-progress": 0, done: 0 };
    for (const s of flow.steps)
      for (const t of s.tasks) counts[t.status] += 1;
    const total = counts.pending + counts["in-progress"] + counts.done;
    const donePct = total === 0 ? 0 : Math.round((counts.done / total) * 100);
    return { ...counts, total, donePct };
  }, [flow]);

  function setStatus(taskId: string, status: TaskStatus) {
    setFlow((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
      })),
    }));
  }

  function selectStep(id: string) {
    const idx = STEP_IDS.indexOf(id as OnboardingStepId);
    if (idx >= 0) {
      setFlow((prev) => ({ ...prev, activeStepIndex: idx }));
    }
  }

  function advance() {
    setFlow((prev) => ({
      ...prev,
      activeStepIndex: Math.min(prev.steps.length - 1, prev.activeStepIndex + 1),
    }));
  }

  function rewind() {
    setFlow((prev) => ({
      ...prev,
      activeStepIndex: Math.max(0, prev.activeStepIndex - 1),
    }));
  }

  const lastStep = flow.activeStepIndex >= flow.steps.length - 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            <ListChecks className="h-3 w-3" />
            Lifecycle · Onboarding
          </div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
            Onboarding wizard
          </h1>
          <p
            className="mt-1 max-w-2xl text-[12.5px]"
            style={{ color: "var(--muted)" }}
          >
            Walk{" "}
            <button
              type="button"
              onClick={() =>
                employee &&
                setDemoHash("people-culture", `employee/${employee.code}`)
              }
              className="font-medium underline-offset-2 hover:underline"
              style={{ color: "var(--fg)" }}
            >
              {employee?.name ?? ONBOARDING_FLOW.employeeCode}
            </button>{" "}
            through the five onboarding stages. Mark tasks done as they
            clear, then send them on to the next step.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <SummaryPill tone="ok" label="Done" count={summary.done} />
          <SummaryPill
            tone="warn"
            label="In progress"
            count={summary["in-progress"]}
          />
          <SummaryPill tone="neutral" label="Pending" count={summary.pending} />
        </div>
      </div>

      <div
        className="flex items-center gap-3 rounded-2xl border p-4 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
          style={{
            backgroundColor: "rgba(79,70,229,0.10)",
            color: "#4F46E5",
          }}
          aria-hidden="true"
        >
          {employee?.name
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold">
              {employee?.name ?? "Unknown employee"}
            </span>
            <span
              className="font-mono text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              {employee?.code}
            </span>
            <Badge tone="accent">{employee?.role}</Badge>
            <Badge tone="warn">Onboarding</Badge>
          </div>
          <div
            className="mt-1 flex flex-wrap items-center gap-3 text-[11px]"
            style={{ color: "var(--muted)" }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Started {flow.startedAt}
            </span>
            <span aria-hidden="true">·</span>
            <span>Target completion {flow.expectedCompletionAt}</span>
            <span aria-hidden="true">·</span>
            <span>{summary.total} tasks total</span>
          </div>
        </div>
        <div className="w-40">
          <div
            className="flex items-center justify-between text-[10.5px] font-medium uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            <span>Progress</span>
            <span className="font-mono tabular-nums">{summary.donePct}%</span>
          </div>
          <div
            className="mt-1 h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--bg)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${summary.donePct}%`,
                backgroundColor: "var(--accent)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside
          className="rounded-2xl border p-4 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <div
            className="px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            Wizard
          </div>
          <Stepper
            steps={flow.steps.map((s) => {
              const stepDoneCount = s.tasks.filter(
                (t) => t.status === "done",
              ).length;
              return {
                id: s.id,
                label: s.label,
                description: `${stepDoneCount} / ${s.tasks.length} tasks`,
              };
            })}
            current={activeStepId}
            onSelect={selectStep}
          />

          <div
            className="mt-4 rounded-xl border p-3"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg)",
            }}
          >
            <div
              className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              <Lightbulb className="h-3 w-3" /> Tip
            </div>
            <p
              className="mt-1.5 text-[11.5px] leading-relaxed"
              style={{ color: "var(--fg)" }}
            >
              Tasks marked <em>pending</em> will be assigned to{" "}
              <strong>{employee?.name?.split(" ")[0] ?? "the employee"}</strong>{" "}
              in their portal. You can reopen any task if more information is
              needed.
            </p>
          </div>
        </aside>

        <section
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <header className="flex items-start justify-between gap-3">
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--muted)" }}
              >
                Step {flow.activeStepIndex + 1} of {flow.steps.length}
              </div>
              <h2 className="mt-1 text-[18px] font-semibold">
                {activeStep.label}
              </h2>
              <p
                className="mt-1 max-w-2xl text-[12.5px]"
                style={{ color: "var(--muted)" }}
              >
                {activeStep.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="accent">{activeStep.tasks.length} tasks</Badge>
              <span
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                <Sparkles className="h-3 w-3" />
                Auto-saved
              </span>
            </div>
          </header>

          <ul className="mt-5 space-y-2.5">
            {activeStep.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-3 rounded-xl border p-3.5"
                style={{ borderColor: "var(--border)" }}
              >
                <TaskIcon status={task.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-medium">
                      {task.title}
                    </span>
                    <TaskStatusBadge status={task.status} />
                    {task.dueLabel && (
                      <span
                        className="flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        <Calendar className="h-2.5 w-2.5" />
                        {task.dueLabel}
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-1 text-[12px] leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {task.detail}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {task.status !== "done" ? (
                    <Button
                      size="sm"
                      onClick={() => setStatus(task.id, "done")}
                    >
                      Mark done
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatus(task.id, "pending")}
                    >
                      Reopen
                    </Button>
                  )}
                  {task.status === "pending" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setStatus(task.id, "in-progress")}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div
            className="mt-5 rounded-xl border p-3"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg)",
            }}
          >
            <div
              className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              <Sparkles className="h-3 w-3" /> What happens next
            </div>
            <p
              className="mt-1.5 text-[12px] leading-relaxed"
              style={{ color: "var(--fg)" }}
            >
              {nextStepHint(activeStepId)}
            </p>
          </div>

          <footer
            className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex items-center gap-2 text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              <span>
                Step {flow.activeStepIndex + 1} of {flow.steps.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{activeStep.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={flow.activeStepIndex === 0}
                onClick={rewind}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous step
              </Button>
              {lastStep ? (
                <Button size="sm">
                  Complete onboarding
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={advance}>
                  Send to next step
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </footer>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-[var(--fg)]"
            >
              <MessageCircle className="h-3 w-3" />
              Message the employee
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-[var(--fg)]"
            >
              View full timeline
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function nextStepHint(activeStepId: OnboardingStepId): string {
  switch (activeStepId) {
    case "offer":
      return "Counter-signed contract will be filed in Documents. Schedule template auto-generates from the role default.";
    case "paperwork":
      return "Banking details feed into payroll. Tax ID is verified against the government database within 24h.";
    case "uniform":
      return "POS role provisioning takes effect on the next shift. Outlet lead is CC'd on the access email.";
    case "training":
      return "Modules are assigned with a 7-day deadline. Quiz scores are surfaced on the training analytics page.";
    case "first-shift":
      return "The 30-day check-in is scheduled automatically. People & Culture will be notified if it slips.";
  }
}

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "var(--ok)" }}
      >
        <CheckCircle2 className="h-4 w-4" />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "var(--warn)" }}
      >
        <CircleDot className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--muted)",
        border: "1px dashed var(--border)",
      }}
    >
      <CircleDashed className="h-4 w-4" />
    </span>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  if (status === "done") return <Badge tone="ok">Done</Badge>;
  if (status === "in-progress") return <Badge tone="warn">In progress</Badge>;
  return <Badge tone="neutral">Pending</Badge>;
}

function SummaryPill({
  tone,
  label,
  count,
}: {
  tone: "ok" | "warn" | "neutral";
  label: string;
  count: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--fg)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor:
            tone === "ok"
              ? "var(--ok)"
              : tone === "warn"
                ? "var(--warn)"
                : "var(--muted)",
        }}
        aria-hidden="true"
      />
      {label}
      <span
        className="font-mono tabular-nums"
        style={{ color: "var(--muted)" }}
      >
        {count}
      </span>
    </span>
  );
}

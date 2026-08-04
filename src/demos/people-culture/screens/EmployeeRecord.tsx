// src/demos/people-culture/screens/EmployeeRecord.tsx
//
// Per-employee drilldown. Production sections — Personal / Employment /
// Documents / Pay / Onboarding — are all rendered here so a visitor
// immediately sees the surface area of the real app. The right rail
// is a documents sidebar listing every synthetic file with a status pill.
//
// Layout: header card with chips; main column with 4 sections
// (Personal, Employment, Pay, Onboarding); right rail with Documents.

import { useMemo } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Cake,
  Briefcase,
  Building2,
  GraduationCap,
  Banknote,
  Pencil,
  MessageCircle,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Download,
  ShieldCheck,
  Wallet,
  TrendingUp,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { EmptyState } from "@/demos/_shared/EmptyState";
import { setDemoHash } from "@/demos/router";
import {
  STATUS_LABEL,
  documentsFor,
  findEmployee,
  OUTLETS,
} from "../mocks";
import type { EmployeeDocument, EmployeeStatus } from "../mocks";

const STATUS_TONE: Record<EmployeeStatus, "ok" | "warn" | "bad" | "info"> = {
  active: "ok",
  onboarding: "warn",
  offboarding: "bad",
  "on-leave": "info",
};

const CATEGORY_TONE: Record<
  EmployeeDocument["category"],
  "neutral" | "info" | "accent" | "warn" | "ok" | "violet"
> = {
  Contract: "neutral",
  ID: "info",
  Certification: "accent",
  Tax: "warn",
  Training: "ok",
  Pay: "violet",
};

const DOC_STATUS_TONE: Record<EmployeeDocument["status"], "ok" | "warn" | "bad" | "neutral"> = {
  verified: "ok",
  pending: "warn",
  rejected: "bad",
  missing: "neutral",
};

function formatIdr(value: number, schedule: "monthly" | "weekly" | "daily"): string {
  const fmt = new Intl.NumberFormat("id-ID").format(value);
  const suffix =
    schedule === "monthly" ? "/mo" : schedule === "weekly" ? "/wk" : "/day";
  return `IDR ${fmt}${suffix}`;
}

export function EmployeeRecord({ code }: { code: string }) {
  const employee = useMemo(() => findEmployee(code), [code]);
  const docs = useMemo(
    () => (employee ? documentsFor(employee.code) : []),
    [employee],
  );

  if (!employee) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDemoHash("people-culture", "directory")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to directory
        </Button>
        <EmptyState
          title="Employee not found"
          description={`No synthetic employee matches code ${code}.`}
        />
      </div>
    );
  }

  const outlet = OUTLETS.find((o) => o.id === employee.outletId);

  const verifiedCount = docs.filter((d) => d.status === "verified").length;
  const pendingCount = docs.filter((d) => d.status === "pending").length;
  const rejectedCount = docs.filter((d) => d.status === "rejected").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--muted)" }}>
        <button
          type="button"
          onClick={() => setDemoHash("people-culture", "directory")}
          className="flex items-center gap-1 rounded-md px-2 py-1 font-medium hover:bg-[var(--surface)]"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Directory
        </button>
        <span aria-hidden="true">›</span>
        <span className="font-mono" style={{ color: "var(--fg)" }}>
          {employee.code}
        </span>
      </div>

      <header
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-[15px] font-semibold"
              style={{
                backgroundColor: "rgba(79,70,229,0.10)",
                color: "#4F46E5",
              }}
              aria-hidden="true"
            >
              {employee.name
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="space-y-2">
              <div>
                <div
                  className="font-mono text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  {employee.code} · {employee.department}
                </div>
                <h1 className="text-[22px] font-semibold tracking-tight">
                  {employee.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="accent">{employee.role}</Badge>
                <Badge tone={STATUS_TONE[employee.status]}>
                  {STATUS_LABEL[employee.status]}
                </Badge>
                <Badge tone="neutral">
                  {outlet?.name ?? employee.outletId}
                </Badge>
                <Badge tone="info">{employee.employmentType}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm">
              <MessageCircle className="h-3.5 w-3.5" />
              Message
            </Button>
            <Button variant="secondary" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit record
            </Button>
            <Button size="sm">
              <ListChecks className="h-3.5 w-3.5" />
              Assign training
            </Button>
          </div>
        </div>

        <div
          className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4"
          style={{ borderColor: "var(--border)" }}
        >
          <KpiCell
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            label="Tenure"
            value={`${employee.tenureMonths} months`}
            sub={`Joined ${employee.joinedAt}`}
          />
          <KpiCell
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Last active"
            value={employee.lastActiveAt}
            sub="From POS / portal"
          />
          <KpiCell
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            label="Documents"
            value={`${verifiedCount} verified`}
            sub={
              pendingCount + rejectedCount > 0
                ? `${pendingCount} pending · ${rejectedCount} rejected`
                : "All clear"
            }
          />
          <KpiCell
            icon={<Wallet className="h-3.5 w-3.5" />}
            label="Pay"
            value={formatIdr(
              employee.payroll.baseSalaryIdr,
              employee.payroll.paySchedule,
            )}
            sub={`${employee.payroll.paySchedule} cycle`}
          />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          {/* Personal */}
          <SectionCard
            title="Personal"
            icon={<Cake className="h-3.5 w-3.5" />}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FieldRow icon={<Mail className="h-3.5 w-3.5" />} label="Email">
                <span className="text-[12.5px]">{employee.email}</span>
              </FieldRow>
              <FieldRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone">
                <span className="font-mono text-[12.5px] tabular-nums">
                  {employee.phone}
                </span>
              </FieldRow>
              <FieldRow icon={<Cake className="h-3.5 w-3.5" />} label="Birthday">
                <span className="text-[12.5px] tabular-nums">
                  {employee.birthday}
                </span>
              </FieldRow>
              <FieldRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Outlet"
              >
                <span className="text-[12.5px]">
                  {outlet?.name ?? employee.outletId}{" "}
                  <span
                    className="ml-1 font-mono text-[10.5px]"
                    style={{ color: "var(--muted)" }}
                  >
                    {employee.outletId}
                  </span>
                </span>
              </FieldRow>
            </div>
            <SubBlock
              title="Emergency contact"
              icon={<AlertCircle className="h-3.5 w-3.5" />}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <span className="text-[12px]" style={{ color: "var(--muted)" }}>
                  {employee.emergencyContact.name}
                </span>
                <span className="text-[12px]" style={{ color: "var(--muted)" }}>
                  {employee.emergencyContact.relation}
                </span>
                <span
                  className="font-mono text-[12px] tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {employee.emergencyContact.phone}
                </span>
              </div>
            </SubBlock>
          </SectionCard>

          {/* Employment */}
          <SectionCard
            title="Employment"
            icon={<Briefcase className="h-3.5 w-3.5" />}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FieldRow
                icon={<Briefcase className="h-3.5 w-3.5" />}
                label="Role"
              >
                <span className="text-[12.5px]">{employee.role}</span>
              </FieldRow>
              <FieldRow
                icon={<Building2 className="h-3.5 w-3.5" />}
                label="Department"
              >
                <span className="text-[12.5px]">{employee.department}</span>
              </FieldRow>
              <FieldRow
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label="Join date"
              >
                <span className="text-[12.5px] tabular-nums">
                  {employee.joinedAt}
                </span>
              </FieldRow>
              <FieldRow
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                label="Tenure"
              >
                <span className="text-[12.5px] tabular-nums">
                  {employee.tenureMonths} months
                </span>
              </FieldRow>
              <FieldRow
                icon={<GraduationCap className="h-3.5 w-3.5" />}
                label="Employment type"
              >
                <span className="text-[12.5px]">
                  {employee.employmentType}
                </span>
              </FieldRow>
              <FieldRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Location"
              >
                <span className="text-[12.5px]">
                  {outlet?.name ?? employee.outletId}
                </span>
              </FieldRow>
            </div>
            <SubBlock
              title="Recent activity"
              icon={<Clock className="h-3.5 w-3.5" />}
            >
              <ul className="space-y-2.5">
                <ActivityRow
                  date={employee.lastActiveAt}
                  body={
                    employee.status === "onboarding"
                      ? "Completed welcome orientation module."
                      : "Shift check-in recorded at the outlet."
                  }
                />
                <ActivityRow
                  date="2026-07-30"
                  body={
                    employee.status === "onboarding"
                      ? "Welcome training started."
                      : "Schedule for next week published."
                  }
                />
                <ActivityRow
                  date="2026-07-22"
                  body="Tax form uploaded and verified."
                />
                <ActivityRow
                  date="2026-07-08"
                  body="Payroll cycle closed with no exceptions."
                />
              </ul>
            </SubBlock>
          </SectionCard>

          {/* Pay */}
          <SectionCard
            title="Pay"
            icon={<Banknote className="h-3.5 w-3.5" />}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FieldRow
                icon={<Wallet className="h-3.5 w-3.5" />}
                label="Base salary"
              >
                <span className="font-mono text-[12.5px] tabular-nums">
                  {formatIdr(
                    employee.payroll.baseSalaryIdr,
                    employee.payroll.paySchedule,
                  )}
                </span>
              </FieldRow>
              <FieldRow
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label="Pay schedule"
              >
                <span className="text-[12.5px] capitalize">
                  {employee.payroll.paySchedule}
                </span>
              </FieldRow>
              <FieldRow
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
                label="Tax status"
              >
                <span className="text-[12.5px]">NPWP on file</span>
              </FieldRow>
            </div>
            <SubBlock
              title="Pay history"
              icon={<TrendingUp className="h-3.5 w-3.5" />}
            >
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {Array.from({ length: 3 }).map((_, i) => {
                  const d = new Date(employee.lastActiveAt);
                  d.setMonth(d.getMonth() - i);
                  const period = d.toISOString().slice(0, 7);
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between py-2 text-[12px]"
                    >
                      <span style={{ color: "var(--muted)" }}>
                        {period}
                      </span>
                      <span
                        className="font-mono tabular-nums"
                        style={{ color: "var(--fg)" }}
                      >
                        {formatIdr(
                          employee.payroll.baseSalaryIdr,
                          employee.payroll.paySchedule,
                        )}
                      </span>
                      <Badge tone="ok">Paid</Badge>
                    </li>
                  );
                })}
              </ul>
            </SubBlock>
          </SectionCard>

          {/* Onboarding / Lifecycle */}
          {employee.status === "onboarding" && (
            <SectionCard
              title="Onboarding"
              icon={<ListChecks className="h-3.5 w-3.5" />}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[12px]">
                  <span style={{ color: "var(--muted)" }}>
                    Started {employee.joinedAt} · expected completion in
                    30 days
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDemoHash("people-culture", "onboarding")}
                  >
                    Open wizard →
                  </Button>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { id: "offer", label: "Offer & contract", done: true },
                    { id: "paperwork", label: "Paperwork & IDs", done: true },
                    { id: "uniform", label: "Uniform & access", done: true },
                    { id: "training", label: "Training modules", done: false },
                    { id: "first-shift", label: "First shift", done: false },
                  ].map((step) => (
                    <li
                      key={step.id}
                      className="flex items-center gap-3 rounded-lg border p-2.5"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: step.done
                            ? "rgba(16,185,129,0.12)"
                            : "var(--bg)",
                          color: step.done
                            ? "var(--ok)"
                            : "var(--muted)",
                        }}
                      >
                        {step.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Clock className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="text-[12.5px] font-medium">
                        {step.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Documents sidebar */}
        <aside
          className="space-y-3 rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--muted)" }}
              >
                Documents
              </div>
              <h2 className="mt-1 text-[14px] font-semibold">Files</h2>
            </div>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              {docs.length} total
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[10.5px]">
            <span
              className="rounded-full border px-2 py-0.5"
              style={{
                borderColor: "var(--border)",
                color: "var(--ok)",
              }}
            >
              {verifiedCount} verified
            </span>
            {pendingCount > 0 && (
              <span
                className="rounded-full border px-2 py-0.5"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--warn)",
                }}
              >
                {pendingCount} pending
              </span>
            )}
            {rejectedCount > 0 && (
              <span
                className="rounded-full border px-2 py-0.5"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--bad)",
                }}
              >
                {rejectedCount} rejected
              </span>
            )}
          </div>

          {docs.length === 0 ? (
            <EmptyState title="No documents yet" />
          ) : (
            <ul className="space-y-2">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-start gap-3 rounded-xl border p-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: "rgba(79,70,229,0.08)",
                      color: "#4F46E5",
                    }}
                  >
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[12.5px] font-medium">
                        {d.title}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10.5px]" style={{ color: "var(--muted)" }}>
                      <Badge tone={CATEGORY_TONE[d.category]}>
                        {d.category}
                      </Badge>
                      <span>{d.uploadedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {d.sizeKb > 0 ? `${d.sizeKb} KB` : "Awaiting upload"}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span
                        className="text-[10.5px] font-medium uppercase tracking-wider"
                        style={{
                          color:
                            d.status === "verified"
                              ? "var(--ok)"
                              : d.status === "pending"
                                ? "var(--warn)"
                                : d.status === "rejected"
                                  ? "var(--bad)"
                                  : "var(--muted)",
                        }}
                      >
                        {d.status}
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[10.5px] font-medium"
                        style={{ color: "var(--accent)" }}
                      >
                        <Download className="h-3 w-3" /> Download
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div
            className="border-t pt-3 text-[11px]"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <p>
              Documents are stored against the employee record. New files
              added to the portal land in <em>pending</em> until verified
              by People &amp; Culture.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Section primitives ----------

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border p-5 shadow-sm"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{
            backgroundColor: "rgba(79,70,229,0.08)",
            color: "#4F46E5",
          }}
        >
          {icon}
        </span>
        <h2 className="text-[14px] font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SubBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mt-2 border-t pt-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="mb-2 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "var(--muted)" }}
      >
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function KpiCell({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: "var(--muted)" }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[14px] font-semibold tabular-nums">
        {value}
      </div>
      {sub && (
        <div className="text-[11px]" style={{ color: "var(--muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function FieldRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--muted)",
        }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.06em]"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function ActivityRow({ date, body }: { date: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: "var(--accent)" }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <div className="text-[12.5px]">{body}</div>
        <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>
          {date}
        </div>
      </div>
    </li>
  );
}

export { DOC_STATUS_TONE };

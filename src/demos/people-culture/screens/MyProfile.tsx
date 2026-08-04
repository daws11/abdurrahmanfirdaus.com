// src/demos/people-culture/screens/MyProfile.tsx
//
// Self-service profile view. Shows the current user (EMP-001) as a
// read-only record with personal, employment, and quick-stats panels.

import {
  Mail,
  Phone,
  MapPin,
  Cake,
  Building2,
  Briefcase,
  Pencil,
  MessageCircle,
  ShieldCheck,
  CalendarDays,
  Banknote,
  Users,
  Heart,
  IdCard,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { findEmployee, OUTLETS, STATUS_LABEL } from "../mocks";
import type { Employee } from "../mocks";

function formatIdr(value: number): string {
  return `IDR ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function MyProfile() {
  const employee = findEmployee("EMP-001");
  if (!employee) {
    return (
      <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>
        No profile found.
      </div>
    );
  }
  const outlet = OUTLETS.find((o) => o.id === employee.outletId);

  // Inline look-alike for the v3 manager + direct-report panels without
  // pulling in the v3 myProfile() helper.
  const syntheticManager: Partial<Employee> | null = (() => {
    const mgrCode = employee.code === "EMP-001" ? "EMP-008" : "EMP-001";
    return findEmployee(mgrCode) ?? null;
  })();

  return (
    <div className="space-y-5">
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
              {initials(employee.name)}
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
                <Badge tone="ok">{STATUS_LABEL[employee.status]}</Badge>
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
              Message P&amp;C
            </Button>
            <Button variant="secondary" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Request edit
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Tenure"
          value={`${employee.tenureMonths} mo`}
          detail={`Joined ${employee.joinedAt}`}
          tone="accent"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <StatTile
          label="Manager"
          value={syntheticManager?.name ?? "—"}
          detail={syntheticManager?.role ?? "—"}
          tone="info"
          icon={<Users className="h-4 w-4" />}
        />
        <StatTile
          label="Base pay"
          value={formatIdr(employee.payroll.baseSalaryIdr)}
          detail={`${employee.payroll.paySchedule} cycle`}
          tone="ok"
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatTile
          label="Last active"
          value={employee.lastActiveAt}
          detail="From POS / portal"
          tone="warn"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Personal" icon={<Cake className="h-3.5 w-3.5" />}>
          <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email">
            {employee.email}
          </Field>
          <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone">
            <span className="font-mono tabular-nums">{employee.phone}</span>
          </Field>
          <Field icon={<Cake className="h-3.5 w-3.5" />} label="Birthday">
            <span className="tabular-nums">{employee.birthday}</span>
          </Field>
          <Field icon={<Heart className="h-3.5 w-3.5" />} label="Marital status">
            Single · 0 dependents
          </Field>
          <Field icon={<IdCard className="h-3.5 w-3.5" />} label="KTP (national ID)">
            <span className="font-mono tabular-nums">3171 4080 0000 0001</span>
          </Field>
        </Section>
        <Section title="Employment" icon={<Briefcase className="h-3.5 w-3.5" />}>
          <Field icon={<Briefcase className="h-3.5 w-3.5" />} label="Role">
            {employee.role}
          </Field>
          <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Department">
            {employee.department}
          </Field>
          <Field icon={<CalendarDays className="h-3.5 w-3.5" />} label="Join date">
            <span className="tabular-nums">{employee.joinedAt}</span>
          </Field>
          <Field icon={<MapPin className="h-3.5 w-3.5" />} label="Outlet">
            {outlet?.name ?? employee.outletId}
          </Field>
          <Field icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Employment type">
            {employee.employmentType}
          </Field>
        </Section>
      </div>
    </div>
  );
}

function Section({
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
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
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
        style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}
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
        <div className="mt-0.5 text-[12.5px]">{children}</div>
      </div>
    </div>
  );
}

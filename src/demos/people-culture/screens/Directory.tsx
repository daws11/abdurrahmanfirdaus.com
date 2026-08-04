// src/demos/people-culture/screens/Directory.tsx
//
// Employee directory. 60-employee roster with status filter pills, free-text
// search, role / outlet / department filter chips, and a clickable table
// that drills into the per-employee record. The header shows three KPI
// tiles (active, onboarding, offboarding) and a department breakdown so
// the page reads as the "command center" of a real People & Culture
// product, not just a list.

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreHorizontal,
  Briefcase,
  UserMinus,
  Users as UsersIcon,
} from "lucide-react";
import { setDemoHash } from "@/demos/router";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { EmptyState } from "@/demos/_shared/EmptyState";
import { StatTile } from "@/demos/_shared/StatTile";
import {
  DEPARTMENT_HEADCOUNT,
  DEPARTMENTS,
  EMPLOYEES,
  OUTLETS,
  WORKFORCE_TOTALS,
} from "../mocks";
import type {
  Department,
  Employee,
  EmployeeStatus,
  EmploymentType,
} from "../mocks";

type StatusFilter = "all" | EmployeeStatus;
type OutletFilter = "all" | (typeof OUTLETS)[number]["id"];
type DeptFilter = "all" | Department;

const STATUS_TONE: Record<EmployeeStatus, "ok" | "warn" | "bad" | "info"> = {
  active: "ok",
  onboarding: "warn",
  offboarding: "bad",
  "on-leave": "info",
};

const STATUS_LABEL: Record<EmployeeStatus, string> = {
  active: "Active",
  onboarding: "Onboarding",
  offboarding: "Offboarding",
  "on-leave": "On leave",
};

const STATUS_PILL_TONE: Record<EmployeeStatus, "ok" | "warn" | "bad" | "info"> = {
  active: "ok",
  onboarding: "warn",
  offboarding: "bad",
  "on-leave": "info",
};

const EMPLOYMENT_TONE: Record<EmploymentType, "accent" | "info" | "neutral" | "violet"> = {
  "Full-time": "accent",
  "Part-time": "info",
  "Daily worker": "violet",
  Contractor: "neutral",
};

function avatarTone(code: string): string {
  // Rotate through indigo, violet, sky, emerald, amber so avatars in the
  // table feel varied without picking up the production avatar URL set.
  const idx = parseInt(code.split("-")[1] ?? "0", 10) - 1;
  const tones = [
    "rgba(79,70,229,0.10)",
    "rgba(139,92,246,0.10)",
    "rgba(14,165,233,0.10)",
    "rgba(16,185,129,0.10)",
    "rgba(245,158,11,0.10)",
    "rgba(244,63,94,0.10)",
  ];
  return tones[idx % tones.length];
}

function avatarFg(code: string): string {
  const idx = parseInt(code.split("-")[1] ?? "0", 10) - 1;
  const tones = [
    "#4F46E5",
    "#8B5CF6",
    "#0EA5E9",
    "#10B981",
    "#F59E0B",
    "#F43F5E",
  ];
  return tones[idx % tones.length];
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Directory() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [outletFilter, setOutletFilter] = useState<OutletFilter>("all");
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EMPLOYEES.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (outletFilter !== "all" && e.outletId !== outletFilter) return false;
      if (deptFilter !== "all" && e.department !== deptFilter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    });
  }, [filter, outletFilter, deptFilter, query]);

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      all: EMPLOYEES.length,
      active: 0,
      onboarding: 0,
      offboarding: 0,
      "on-leave": 0,
    };
    for (const e of EMPLOYEES) base[e.status] += 1;
    return base;
  }, []);

  const columns: Column<Employee>[] = [
    {
      key: "code",
      header: "Code",
      cell: (row) => (
        <span className="font-mono text-[11px]" style={{ color: "var(--muted)" }}>
          {row.code}
        </span>
      ),
      sortBy: (row) => row.code,
      className: "w-[72px]",
    },
    {
      key: "name",
      header: "Employee",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{
              backgroundColor: avatarTone(row.code),
              color: avatarFg(row.code),
            }}
            aria-hidden="true"
          >
            {initials(row.name)}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium" style={{ color: "var(--fg)" }}>
              {row.name}
            </div>
            <div className="truncate text-[11px]" style={{ color: "var(--muted)" }}>
              {row.email}
            </div>
          </div>
        </div>
      ),
      sortBy: (row) => row.name,
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[12.5px]" style={{ color: "var(--fg)" }}>
            {row.role}
          </span>
          <span className="text-[10.5px]" style={{ color: "var(--muted)" }}>
            {row.department}
          </span>
        </div>
      ),
      sortBy: (row) => row.role,
    },
    {
      key: "outlet",
      header: "Outlet",
      cell: (row) => {
        const outlet = OUTLETS.find((o) => o.id === row.outletId);
        return (
          <span className="text-[12.5px]">
            {outlet?.name ?? row.outletId}
            <span
              className="ml-1.5 font-mono text-[10.5px]"
              style={{ color: "var(--muted)" }}
            >
              {row.outletId}
            </span>
          </span>
        );
      },
      sortBy: (row) => row.outletId,
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <Badge tone={EMPLOYMENT_TONE[row.employmentType]}>
          {row.employmentType}
        </Badge>
      ),
      sortBy: (row) => row.employmentType,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[12.5px] tabular-nums">{row.joinedAt}</span>
          <span className="text-[10.5px]" style={{ color: "var(--muted)" }}>
            {row.tenureMonths} mo
          </span>
        </div>
      ),
      sortBy: (row) => row.joinedAt,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge tone={STATUS_PILL_TONE[row.status]}>
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
      sortBy: (row) => row.status,
      className: "w-[120px]",
    },
  ];

  const activeFilters =
    (filter !== "all" ? 1 : 0) +
    (outletFilter !== "all" ? 1 : 0) +
    (deptFilter !== "all" ? 1 : 0) +
    (query ? 1 : 0);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            Workforce · Directory
          </div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
            {counts.all} people across {OUTLETS.length} locations
          </h1>
          <p
            className="mt-1 max-w-2xl text-[12.5px]"
            style={{ color: "var(--muted)" }}
          >
            Browse the active roster, filter by lifecycle stage or outlet, and
            open a record to review role, employment type, and onboarding
            documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-3.5 w-3.5" />
            Add employee
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Headcount"
          value={WORKFORCE_TOTALS.headcount}
          detail={`${WORKFORCE_TOTALS.avgTenureMonths} mo avg tenure`}
          tone="accent"
          icon={<UsersIcon className="h-4 w-4" />}
        />
        <StatTile
          label="Active"
          value={WORKFORCE_TOTALS.active}
          detail="Currently scheduled"
          tone="ok"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <StatTile
          label="Onboarding"
          value={WORKFORCE_TOTALS.onboarding}
          detail="In their first 90 days"
          tone="warn"
          icon={<UserPlus className="h-4 w-4" />}
        />
        <StatTile
          label="Offboarding"
          value={
            WORKFORCE_TOTALS.offboarding + WORKFORCE_TOTALS.onLeave
          }
          detail={`${WORKFORCE_TOTALS.offboarding} leaving · ${WORKFORCE_TOTALS.onLeave} on leave`}
          tone="bad"
          icon={<UserMinus className="h-4 w-4" />}
        />
      </div>

      <div
        className="rounded-2xl border p-3 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, code, role, email…"
              className="h-9 w-72 rounded-xl border bg-transparent pl-9 pr-3 text-[12.5px] focus:outline-none focus:ring-1"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
              aria-label="Search directory"
            />
          </div>

          <div className="ml-2 flex items-center gap-1.5">
            {(
              ["all", "active", "onboarding", "offboarding", "on-leave"] as StatusFilter[]
            ).map((key) => {
              const active = filter === key;
              const label = key === "all" ? "All" : STATUS_LABEL[key as EmployeeStatus];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className="flex h-8 items-center gap-1.5 rounded-full border px-3 text-[10.5px] font-semibold uppercase tracking-[0.06em] transition-colors"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--border)",
                    backgroundColor: active
                      ? "rgba(79,70,229,0.08)"
                      : "transparent",
                    color: active ? "var(--accent)" : "var(--muted)",
                  }}
                  aria-pressed={active}
                >
                  {label}
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] tabular-nums"
                    style={{
                      backgroundColor: active
                        ? "var(--accent)"
                        : "var(--bg)",
                      color: active ? "var(--accent-fg)" : "var(--muted)",
                    }}
                  >
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value as OutletFilter)}
              className="h-8 rounded-lg border bg-transparent px-2.5 text-[12px] focus:outline-none focus:ring-1"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
              aria-label="Filter by outlet"
            >
              <option value="all">All outlets</option>
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as DeptFilter)}
              className="h-8 rounded-lg border bg-transparent px-2.5 text-[12px] focus:outline-none focus:ring-1"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
              aria-label="Filter by department"
            >
              <option value="all">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
              aria-label="More filters"
            >
              <Filter className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {activeFilters > 0 && (
          <div
            className="mt-2 flex flex-wrap items-center gap-1.5 border-t pt-2 text-[11px]"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <span className="font-medium uppercase tracking-wider">
              {activeFilters} active filter{activeFilters === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setOutletFilter("all");
                setDeptFilter("all");
                setQuery("");
              }}
              className="ml-1 rounded-full border px-2 py-0.5 text-[10px] font-medium hover:bg-[var(--bg)]"
              style={{
                borderColor: "var(--border)",
                color: "var(--accent)",
              }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No matches"
          description="Try a different name, role, status, or outlet filter."
        />
      ) : (
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(row) => row.code}
          onRowClick={(row) => setDemoHash("people-culture", `employee/${row.code}`)}
          initialSort={{ key: "code", dir: "asc" }}
          emptyTitle="No employees"
        />
      )}

      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 text-[11px] shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--muted)",
        }}
      >
        <div className="flex items-center gap-3">
          <span>Showing {rows.length} of {counts.all} employees</span>
          <span aria-hidden="true">·</span>
          <span>
            {DEPARTMENT_HEADCOUNT.slice(0, 4)
              .map((d) => `${d.department} ${d.count}`)
              .join(" · ")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-[var(--bg)]"
            style={{ borderColor: "var(--border)" }}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="px-2 font-mono tabular-nums">1 / 3</span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-[var(--bg)]"
            style={{ borderColor: "var(--border)" }}
            aria-label="Next page"
          >
            ›
          </button>
          <button
            type="button"
            className="ml-2 flex h-7 items-center gap-1 rounded-md border px-2 hover:bg-[var(--bg)]"
            style={{ borderColor: "var(--border)" }}
            aria-label="Row actions"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
            Bulk actions
          </button>
        </div>
      </div>
    </div>
  );
}

export { STATUS_TONE, STATUS_LABEL };

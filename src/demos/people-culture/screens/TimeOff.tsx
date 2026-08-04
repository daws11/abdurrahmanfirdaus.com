// src/demos/people-culture/screens/TimeOff.tsx
//
// Time off requests — list with stat tiles, filter chips, and a table.
// Self-contained: builds a 12-row fixture from the v2 EMPLOYEES so the
// screen works without the v3 timeOffRequests helper.

import { useMemo, useState } from "react";
import {
  Check,
  X,
  Clock,
  Search,
  CalendarOff,
  Plane,
  Stethoscope,
  User,
  HeartHandshake,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Sheet } from "@/demos/_shared/Sheet";
import { StatTile } from "@/demos/_shared/StatTile";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { findEmployee, EMPLOYEES } from "../mocks";

type TimeOffStatus = "pending" | "approved" | "denied" | "cancelled";
type TimeOffType = "vacation" | "sick" | "personal" | "bereavement";

interface TimeOffRow {
  id: string;
  employeeCode: string;
  employeeName: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  days: number;
  status: TimeOffStatus;
  requestedAt: string;
  approver: string | null;
  reason: string;
}

const STATUS_TONE: Record<TimeOffStatus, "ok" | "warn" | "bad" | "neutral"> = {
  approved: "ok",
  pending: "warn",
  denied: "bad",
  cancelled: "neutral",
};

const STATUS_LABEL: Record<TimeOffStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  denied: "Denied",
  cancelled: "Cancelled",
};

const TYPE_LABEL: Record<TimeOffType, string> = {
  vacation: "Vacation",
  sick: "Sick",
  personal: "Personal",
  bereavement: "Bereavement",
};

const TYPE_ICON: Record<TimeOffType, React.ReactNode> = {
  vacation: <Plane className="h-3.5 w-3.5" />,
  sick: <Stethoscope className="h-3.5 w-3.5" />,
  personal: <User className="h-3.5 w-3.5" />,
  bereavement: <HeartHandshake className="h-3.5 w-3.5" />,
};

const REASONS = [
  "Family trip to Bali",
  "Flu, doctor's note attached",
  "Wedding attendance",
  "Year-end reset",
  "Migraine",
  "Pre-maternity leave",
  "Family bereavement",
  "Honeymoon",
  "Schedule conflict",
  "School break with kids",
  "Visa appointment overseas",
  "Recovering from minor procedure",
];

function buildFixture(): TimeOffRow[] {
  const types: TimeOffType[] = [
    "vacation",
    "sick",
    "personal",
    "bereavement",
    "vacation",
    "vacation",
    "bereavement",
    "vacation",
    "personal",
    "vacation",
    "personal",
    "sick",
  ];
  const statuses: TimeOffStatus[] = [
    "approved",
    "approved",
    "pending",
    "pending",
    "approved",
    "approved",
    "approved",
    "pending",
    "denied",
    "pending",
    "pending",
    "approved",
  ];
  const startDates = [
    "2026-08-15",
    "2026-08-01",
    "2026-08-12",
    "2026-09-01",
    "2026-07-30",
    "2026-10-01",
    "2026-07-28",
    "2026-08-20",
    "2026-08-08",
    "2026-09-15",
    "2026-08-25",
    "2026-08-03",
  ];
  const days = [7, 2, 1, 5, 1, 11, 3, 5, 1, 5, 5, 2];
  const requestedAt = [
    "2026-07-10",
    "2026-08-01",
    "2026-08-02",
    "2026-07-29",
    "2026-07-30",
    "2026-07-15",
    "2026-07-28",
    "2026-08-02",
    "2026-07-30",
    "2026-08-01",
    "2026-08-02",
    "2026-08-03",
  ];
  const approvers: (string | null)[] = [
    "EMP-008",
    "EMP-001",
    null,
    null,
    "EMP-021",
    "EMP-008",
    "EMP-001",
    null,
    "EMP-001",
    null,
    null,
    "EMP-021",
  ];
  // Pick 12 employees (cycle through roster) to attach the requests to.
  const subset = EMPLOYEES.slice(0, 12);
  return types.map((t, i) => {
    const start = new Date(startDates[i]);
    const end = new Date(start);
    end.setDate(start.getDate() + days[i] - 1);
    const emp = subset[i] ?? subset[0];
    return {
      id: `TO-${String(i + 1).padStart(3, "0")}`,
      employeeCode: emp.code,
      employeeName: emp.name,
      type: t,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      days: days[i],
      status: statuses[i],
      requestedAt: requestedAt[i],
      approver: approvers[i],
      reason: REASONS[i],
    };
  });
}

type Filter = "all" | TimeOffStatus;

export function TimeOff() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<TimeOffRow | null>(null);

  const rows = useMemo<TimeOffRow[]>(() => buildFixture(), []);

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeCode.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    });
  }, [filter, query, rows]);

  const totals = useMemo(() => {
    const counts: Record<TimeOffStatus, number> = {
      approved: 0,
      pending: 0,
      denied: 0,
      cancelled: 0,
    };
    for (const r of rows) counts[r.status] += 1;
    return counts;
  }, [rows]);

  const columns: Column<TimeOffRow>[] = [
    {
      key: "employee",
      header: "Employee",
      cell: (r) => (
        <div className="flex flex-col">
          <span className="text-[12.5px] font-medium">{r.employeeName}</span>
          <span
            className="font-mono text-[10.5px]"
            style={{ color: "var(--muted)" }}
          >
            {r.employeeCode}
          </span>
        </div>
      ),
      sortBy: (r) => r.employeeName,
    },
    {
      key: "type",
      header: "Type",
      cell: (r) => (
        <div className="flex items-center gap-1.5 text-[12.5px]">
          {TYPE_ICON[r.type]}
          {TYPE_LABEL[r.type]}
        </div>
      ),
      sortBy: (r) => r.type,
    },
    {
      key: "window",
      header: "Window",
      cell: (r) => (
        <div className="flex flex-col">
          <span className="font-mono text-[11.5px] tabular-nums">
            {r.startDate} → {r.endDate}
          </span>
          <span
            className="text-[10.5px]"
            style={{ color: "var(--muted)" }}
          >
            {r.days} day{r.days === 1 ? "" : "s"}
          </span>
        </div>
      ),
      sortBy: (r) => r.startDate,
    },
    {
      key: "reason",
      header: "Reason",
      cell: (r) => (
        <span className="line-clamp-1 text-[12px]" style={{ color: "var(--muted)" }}>
          {r.reason}
        </span>
      ),
    },
    {
      key: "requested",
      header: "Requested",
      cell: (r) => (
        <span className="font-mono text-[11.5px] tabular-nums">
          {r.requestedAt}
        </span>
      ),
      sortBy: (r) => r.requestedAt,
    },
    {
      key: "approver",
      header: "Approver",
      cell: (r) =>
        r.approver ? (
          <span className="font-mono text-[11.5px]">{r.approver}</span>
        ) : (
          <span
            className="text-[11.5px]"
            style={{ color: "var(--muted)" }}
          >
            — pending —
          </span>
        ),
      sortBy: (r) => r.approver ?? "",
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
      ),
      sortBy: (r) => r.status,
      className: "w-[120px]",
    },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--muted)" }}
          >
            Workforce · Time off
          </div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
            Time off requests
          </h1>
          <p
            className="mt-1 max-w-2xl text-[12.5px]"
            style={{ color: "var(--muted)" }}
          >
            Approve, deny, or cancel leave requests. Outlet leads can act
            on requests from their team; P&amp;C can act on anyone.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Pending"
          value={totals.pending}
          detail="awaiting approval"
          tone="warn"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatTile
          label="Approved"
          value={totals.approved}
          detail="this month"
          tone="ok"
          icon={<Check className="h-4 w-4" />}
        />
        <StatTile
          label="Denied"
          value={totals.denied}
          detail="this month"
          tone="bad"
          icon={<X className="h-4 w-4" />}
        />
        <StatTile
          label="Total"
          value={rows.length}
          detail="all time"
          tone="accent"
          icon={<CalendarOff className="h-4 w-4" />}
        />
      </div>

      <div
        className="rounded-2xl border p-4 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex flex-1 items-center gap-2 rounded-md border px-2.5 py-1.5"
            style={{ borderColor: "var(--border)" }}
          >
            <Search
              className="h-3.5 w-3.5"
              style={{ color: "var(--muted)" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by employee, code, or reason…"
              className="w-full bg-transparent text-[12.5px] focus:outline-none"
              aria-label="Search time-off"
            />
          </div>
          <div className="flex items-center gap-1">
            {(["all", "pending", "approved", "denied"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="rounded-md border px-2.5 py-1 text-[11px] font-medium capitalize"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor:
                    filter === f ? "var(--accent)" : "transparent",
                  color: filter === f ? "var(--accent-fg)" : "var(--fg)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        rows={visibleRows}
        columns={columns}
        rowKey={(r) => r.id}
        onRowClick={(r) => setOpen(r)}
        emptyTitle="No requests match this filter"
      />

      <Sheet
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open ? `Request ${open.id}` : undefined}
        width={460}
      >
        {open && <RequestDetail row={open} />}
      </Sheet>
    </div>
  );
}

function RequestDetail({ row }: { row: TimeOffRow }) {
  const approver = row.approver ? findEmployee(row.approver) : null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={STATUS_TONE[row.status]}>
          {STATUS_LABEL[row.status]}
        </Badge>
        <Badge tone="info">{TYPE_LABEL[row.type]}</Badge>
        <Badge tone="neutral">{row.days} day{row.days === 1 ? "" : "s"}</Badge>
      </div>
      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--fg)" }}>
        {row.reason}
      </p>
      <dl className="space-y-2 text-[12.5px]">
        <Row label="Employee" value={`${row.employeeName} (${row.employeeCode})`} />
        <Row label="Window" value={`${row.startDate} → ${row.endDate}`} />
        <Row label="Requested" value={row.requestedAt} />
        <Row
          label="Approver"
          value={approver ? `${approver.name} (${approver.code})` : "— pending —"}
        />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt
        className="text-[10.5px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </dt>
      <dd className="text-[12.5px]">{value}</dd>
    </div>
  );
}

// src/demos/people-culture/mocks.ts
//
// Synthetic fixtures for the People & Culture demo. Every name, ID, code,
// and outlet is a generic placeholder. The dataset is scaled to 60
// employees — enough to make the directory feel like a real roster
// without ballooning the bundle.
//
// Field shapes mirror the production app's `Employee` type
// (see data-shapes/overview.ts) loosely: id, name, email, role, outlet,
// department, status, employmentType, joinDate, lastActive. None of those
// values are copied from production; they are reconstructed from the
// role taxonomy defined below.

import { OUTLETS, type OutletId } from "@/demos/_shared/fixtures/inventory";

// ---------- Role + department vocabularies ----------

export type Role =
  | "Outlet Lead"
  | "Shift Supervisor"
  | "Barista"
  | "Kitchen Staff"
  | "Trainer"
  | "Warehouse Lead"
  | "Warehouse Staff"
  | "HR Coordinator"
  | "Finance Lead";

export const ROLES: Role[] = [
  "Outlet Lead",
  "Shift Supervisor",
  "Barista",
  "Kitchen Staff",
  "Trainer",
  "Warehouse Lead",
  "Warehouse Staff",
  "HR Coordinator",
  "Finance Lead",
];

export type Department =
  | "Operations"
  | "Coffee Bar"
  | "Kitchen"
  | "Warehouse"
  | "Training"
  | "People & Culture"
  | "Finance";

export const DEPARTMENTS: Department[] = [
  "Operations",
  "Coffee Bar",
  "Kitchen",
  "Warehouse",
  "Training",
  "People & Culture",
  "Finance",
];

// Department each role is part of. Used for filtering and to populate the
// chip strip on the employee record.
export const ROLE_DEPARTMENT: Record<Role, Department> = {
  "Outlet Lead": "Operations",
  "Shift Supervisor": "Operations",
  Barista: "Coffee Bar",
  "Kitchen Staff": "Kitchen",
  Trainer: "Training",
  "Warehouse Lead": "Warehouse",
  "Warehouse Staff": "Warehouse",
  "HR Coordinator": "People & Culture",
  "Finance Lead": "Finance",
};

// ---------- Employment types ----------

export type EmploymentType = "Full-time" | "Part-time" | "Daily worker" | "Contractor";

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Daily worker",
  "Contractor",
];

// ---------- Employee statuses ----------

export type EmployeeStatus = "active" | "onboarding" | "offboarding" | "on-leave";

export const STATUS_LABEL: Record<EmployeeStatus, string> = {
  active: "Active",
  onboarding: "Onboarding",
  offboarding: "Offboarding",
  "on-leave": "On leave",
};

export interface Employee {
  code: string;
  name: string;
  role: Role;
  department: Department;
  outletId: OutletId;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  joinedAt: string;
  lastActiveAt: string;
  /** Tenure in months (computed at fixture-build time). */
  tenureMonths: number;
  email: string;
  phone: string;
  birthday: string;
  payroll: {
    baseSalaryIdr: number;
    paySchedule: "monthly" | "weekly" | "daily";
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

// ---------- Name list (generic, no real staff) ----------
//
// 60 made-up display names. Built from a small pool of first names and
// last initials so every employee looks distinct but no name corresponds
// to a real person.

const FIRST_NAMES = [
  "Alex", "Rina", "Bagas", "Citra", "Dimas", "Eka", "Fajar", "Gita",
  "Hadi", "Indah", "Jaka", "Kirana", "Lutfi", "Maya", "Nanda", "Oki",
  "Putri", "Rama", "Sari", "Tegar", "Utami", "Vina", "Wahyu", "Yusuf",
  "Zara", "Adi", "Bayu", "Cahya", "Dewi", "Erwin", "Fitri", "Galih",
  "Hana", "Irfan", "Jihan", "Kemal", "Lestari", "Mahesa", "Nadia",
  "Omar", "Pandu", "Qori", "Rio", "Sinta", "Tantri", "Ujang", "Vera",
  "Wawan", "Yanti", "Zaki", "Anggi", "Bima", "Candra", "Dinda", "Erik",
  "Fadhil", "Gading", "Hesti", "Ika",
];

const LAST_INITIALS = "ABCDEFGHIJKLMNPQRSTUVWXYZ".split("");

// ---------- Outlet + role rotation ----------

// Heavier skew on Barista / Kitchen Staff because that's the bulk of an
// outlet workforce. Senior roles are sprinkled in.
const ROLE_ROTATION: Role[] = [
  "Outlet Lead", "Barista", "Barista", "Barista", "Barista",
  "Shift Supervisor", "Barista", "Kitchen Staff", "Kitchen Staff",
  "Barista", "Trainer", "Warehouse Staff", "HR Coordinator",
  "Finance Lead", "Barista", "Kitchen Staff", "Barista", "Barista",
  "Shift Supervisor", "Outlet Lead", "Barista", "Kitchen Staff",
  "Warehouse Lead", "Barista", "Shift Supervisor", "Barista", "Barista",
  "Kitchen Staff", "Barista", "Trainer", "Barista", "Kitchen Staff",
  "Outlet Lead", "Barista", "Shift Supervisor", "Barista", "Barista",
  "Kitchen Staff", "Barista", "Warehouse Staff", "HR Coordinator",
  "Barista", "Kitchen Staff", "Barista", "Shift Supervisor", "Barista",
  "Outlet Lead", "Barista", "Kitchen Staff", "Barista", "Trainer",
  "Barista", "Barista", "Kitchen Staff", "Barista", "Warehouse Staff",
  "Shift Supervisor", "Barista", "Outlet Lead", "Finance Lead",
];

const OUTLET_ROTATION: OutletId[] = [
  "O1", "O1", "O1", "O1", "O1", "O1", "O1", "O1", "O1",
  "O2", "O2", "O2", "O2", "O2", "O2", "O2", "O2",
  "O3", "O3", "O3", "O3", "O3", "O3", "O3", "O3",
  "O4", "O4", "O4", "O4", "O4", "O4",
  "O5", "O5", "O5", "O5", "O5", "O5",
  "WH", "WH", "WH", "WH",
  "O1", "O1", "O2", "O2", "O3", "O3",
  "O4", "O4", "O5", "O5",
  "O1", "O2", "O3", "WH", "O1", "O2", "O3", "O4",
];

// 5 onboarding (last 90 days), 4 offboarding (notice served), 3 on leave,
// rest active. Skewed toward active since most of the roster is steady-state.
const STATUS_ROTATION: EmployeeStatus[] = [
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active", "active", "active",
  "active", "active", "active", "active", "active",
  "onboarding", "onboarding", "onboarding", "onboarding", "onboarding",
  "offboarding", "offboarding", "offboarding", "offboarding",
  "on-leave", "on-leave", "on-leave",
];

const EMPLOYMENT_ROTATION: EmploymentType[] = [
  "Full-time", "Part-time", "Full-time", "Part-time", "Daily worker",
  "Full-time", "Part-time", "Full-time", "Full-time", "Part-time",
  "Full-time", "Daily worker", "Full-time", "Full-time", "Part-time",
  "Full-time", "Full-time", "Part-time", "Full-time", "Full-time",
  "Part-time", "Full-time", "Full-time", "Part-time", "Full-time",
  "Full-time", "Part-time", "Full-time", "Full-time", "Daily worker",
  "Full-time", "Part-time", "Full-time", "Part-time", "Full-time",
  "Full-time", "Part-time", "Full-time", "Full-time", "Daily worker",
  "Full-time", "Part-time", "Full-time", "Full-time", "Part-time",
  "Full-time", "Part-time", "Full-time", "Full-time", "Part-time",
  "Full-time", "Full-time", "Contractor", "Full-time", "Full-time",
  "Part-time", "Full-time", "Part-time", "Full-time", "Full-time",
  "Full-time", "Full-time", "Part-time", "Part-time",
];

// Join dates spread over ~3 years. Newer employees (onboarding cohort)
// get dates inside the last 90 days from the reference date.
const JOIN_DATES: string[] = [
  "2023-05-12", "2023-08-04", "2023-11-22", "2024-01-08", "2024-02-17",
  "2024-03-30", "2024-04-14", "2024-05-02", "2024-05-21", "2024-06-09",
  "2024-06-30", "2024-07-14", "2024-08-02", "2024-08-21", "2024-09-05",
  "2024-09-13", "2024-09-30", "2024-10-10", "2024-10-28", "2024-11-08",
  "2024-11-19", "2024-12-01", "2024-12-19", "2025-01-08", "2025-01-22",
  "2025-02-04", "2025-02-14", "2025-03-01", "2025-03-12", "2025-03-29",
  "2025-04-05", "2025-04-17", "2025-04-30", "2025-05-12", "2025-05-22",
  "2025-06-02", "2025-06-15", "2025-06-29", "2025-07-10", "2025-07-21",
  "2025-08-04", "2025-08-15", "2025-08-30", "2025-09-08", "2025-09-22",
  "2025-10-03", "2025-10-19", "2025-11-01", "2025-11-18", "2025-12-04",
  "2025-12-19", "2026-01-08", "2026-01-26", "2026-02-14", "2026-03-04",
  "2026-03-22", "2026-04-09", "2026-05-01", "2026-07-22", "2026-07-29",
];

// ---------- Build helper ----------

const REFERENCE_DATE = new Date("2026-08-03");

function monthsBetween(fromIso: string): number {
  const from = new Date(fromIso);
  return Math.max(
    0,
    (REFERENCE_DATE.getFullYear() - from.getFullYear()) * 12 +
      (REFERENCE_DATE.getMonth() - from.getMonth()),
  );
}

function lastActiveFor(status: EmployeeStatus, idx: number): string {
  if (status === "onboarding") return "2026-08-01";
  if (status === "offboarding") return "2026-07-28";
  if (status === "on-leave") return "2026-07-15";
  // Active employees: stagger by index so the column isn't uniform.
  // Most within 2 days, some within the last week.
  const day = ((idx * 137) % 14) + 1;
  if (day > 7) return "2026-07-28";
  if (day > 4) return "2026-08-01";
  if (day > 2) return "2026-08-02";
  return "2026-08-03";
}

function birthdayFor(idx: number): string {
  // Cycle 12 month-day pairs, vary the year so ages feel natural.
  const md = [
    "01-14", "02-09", "03-22", "04-17", "05-30", "06-12",
    "07-04", "08-21", "09-09", "10-19", "11-28", "12-15",
  ];
  const monthDay = md[idx % md.length];
  const year = 1985 + ((idx * 11) % 25);
  return `${year}-${monthDay}`;
}

function emergencyContactFor(idx: number): Employee["emergencyContact"] {
  const relations = ["Spouse", "Parent", "Sibling", "Partner"];
  const fallbackNames = ["Person A", "Person B", "Person C", "Person D"];
  return {
    name: fallbackNames[idx % fallbackNames.length],
    relation: relations[idx % relations.length],
    phone: `+0000${String(2000 + idx * 7).slice(-4)}`,
  };
}

function payFor(role: Role, employmentType: EmploymentType): Employee["payroll"] {
  let base = 4_500_000; // IDR base
  if (role === "Outlet Lead") base = 7_500_000;
  else if (role === "Finance Lead") base = 9_000_000;
  else if (role === "HR Coordinator") base = 6_500_000;
  else if (role === "Trainer") base = 5_800_000;
  else if (role === "Warehouse Lead") base = 6_200_000;
  else if (role === "Shift Supervisor") base = 5_200_000;
  else if (role === "Barista") base = 4_200_000;
  else if (role === "Kitchen Staff") base = 4_400_000;
  else if (role === "Warehouse Staff") base = 4_300_000;

  if (employmentType === "Part-time") base = Math.round(base * 0.55);
  if (employmentType === "Daily worker") base = Math.round(base / 22);
  if (employmentType === "Contractor") base = Math.round(base * 1.15);

  const paySchedule: Employee["payroll"]["paySchedule"] =
    employmentType === "Daily worker"
      ? "daily"
      : employmentType === "Part-time"
        ? "weekly"
        : "monthly";
  return { baseSalaryIdr: base, paySchedule };
}

// ---------- Roster ----------

export const EMPLOYEES: Employee[] = Array.from({ length: 60 }, (_, i) => {
  const n = i + 1;
  const code = `EMP-${String(n).padStart(3, "0")}`;
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const initial = LAST_INITIALS[Math.floor(i / FIRST_NAMES.length) % LAST_INITIALS.length];
  const name = `${first} ${initial}.`;
  const role = ROLE_ROTATION[i];
  const department = ROLE_DEPARTMENT[role];
  const outletId = OUTLET_ROTATION[i];
  const status = STATUS_ROTATION[i];
  const employmentType = EMPLOYMENT_ROTATION[i];
  const joinedAt = JOIN_DATES[i];
  const tenureMonths = monthsBetween(joinedAt);
  const email = `${code.toLowerCase()}@example.test`;
  const phone = `+0000${String(1000 + n).slice(-4)}`;
  const birthday = birthdayFor(i);
  const payroll = payFor(role, employmentType);
  const emergencyContact = emergencyContactFor(i);
  const lastActiveAt = lastActiveFor(status, i);
  return {
    code,
    name,
    role,
    department,
    outletId,
    status,
    employmentType,
    joinedAt,
    tenureMonths,
    email,
    phone,
    birthday,
    payroll,
    emergencyContact,
    lastActiveAt,
  };
});

export function findEmployee(code: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.code === code);
}

// ---------- Documents (mocked file list per employee) ----------

export interface EmployeeDocument {
  id: string;
  employeeCode: string;
  title: string;
  category: "Contract" | "ID" | "Certification" | "Tax" | "Training" | "Pay";
  uploadedAt: string;
  sizeKb: number;
  status: "verified" | "pending" | "missing" | "rejected";
}

const DOC_TEMPLATES: {
  title: string;
  category: EmployeeDocument["category"];
  sizeKb: number;
}[] = [
  { title: "Employment contract", category: "Contract", sizeKb: 184 },
  { title: "Counter-signed offer letter", category: "Contract", sizeKb: 96 },
  { title: "Government ID (KTP)", category: "ID", sizeKb: 412 },
  { title: "Tax identification card (NPWP)", category: "Tax", sizeKb: 78 },
  { title: "Bank account form", category: "Pay", sizeKb: 64 },
  { title: "Food handler certification", category: "Certification", sizeKb: 220 },
  { title: "First-aid certification", category: "Certification", sizeKb: 168 },
  { title: "Welcome orientation module", category: "Training", sizeKb: 0 },
  { title: "Role playbook — completion", category: "Training", sizeKb: 0 },
];

export const DOCUMENTS: EmployeeDocument[] = EMPLOYEES.flatMap((e) => {
  const rows: EmployeeDocument[] = DOC_TEMPLATES.map((tpl, i) => {
    // Newer employees are missing the most recent docs; long-tenured are
    // fully verified. Some onboarding employees have a pending module.
    const isRecent = i >= DOC_TEMPLATES.length - 2;
    const isPay = tpl.category === "Pay";
    let status: EmployeeDocument["status"];
    if (e.status === "onboarding" && isRecent) status = "pending";
    else if (e.status === "offboarding" && isPay) status = "pending";
    else if (e.status === "on-leave" && isRecent) status = "pending";
    else if (e.tenureMonths < 3 && isRecent) status = "pending";
    else status = "verified";

    return {
      id: `${e.code}-DOC-${String(i + 1).padStart(2, "0")}`,
      employeeCode: e.code,
      title: tpl.title,
      category: tpl.category,
      uploadedAt:
        status === "pending"
          ? "—"
          : new Date(
              new Date(e.joinedAt).getTime() + i * 86400000,
            )
              .toISOString()
              .slice(0, 10),
      sizeKb: tpl.sizeKb,
      status,
    };
  });
  return rows;
});

export function documentsFor(code: string): EmployeeDocument[] {
  return DOCUMENTS.filter((d) => d.employeeCode === code);
}

// ---------- Onboarding wizard steps ----------

export type OnboardingStepId =
  | "offer"
  | "paperwork"
  | "uniform"
  | "training"
  | "first-shift";

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  description: string;
  /** Synthetic tasks belonging to this step. */
  tasks: OnboardingTask[];
}

export type TaskStatus = "pending" | "in-progress" | "done";

export interface OnboardingTask {
  id: string;
  step: OnboardingStepId;
  title: string;
  detail: string;
  status: TaskStatus;
  /** Optional due offset (e.g. "Day 1", "Week 1") for timeline display. */
  dueLabel?: string;
}

export interface OnboardingFlow {
  employeeCode: string;
  startedAt: string;
  expectedCompletionAt: string;
  steps: OnboardingStep[];
  /** Index of the active step in the flow (0-based). */
  activeStepIndex: number;
}

function buildFlow(emp: Employee): OnboardingFlow {
  const steps: OnboardingStep[] = [
    {
      id: "offer",
      label: "Offer & contract",
      description: "Signed offer letter, role assignment, base schedule.",
      tasks: [
        {
          id: `${emp.code}-T1`,
          step: "offer",
          title: "Offer letter signed",
          detail: `${emp.name} acknowledged the offer for ${emp.role} at ${emp.outletId}.`,
          status: "done",
          dueLabel: "Day -7",
        },
        {
          id: `${emp.code}-T2`,
          step: "offer",
          title: "Contract counter-signed",
          detail: "Counter-signed PDF saved to the employee file.",
          status: "done",
          dueLabel: "Day -5",
        },
        {
          id: `${emp.code}-T3`,
          step: "offer",
          title: "Schedule template published",
          detail: "Default shift pattern generated for the first 4 weeks.",
          status: "done",
          dueLabel: "Day -3",
        },
      ],
    },
    {
      id: "paperwork",
      label: "Paperwork & IDs",
      description: "Tax forms, government ID, banking details.",
      tasks: [
        {
          id: `${emp.code}-T4`,
          step: "paperwork",
          title: "Tax form (NPWP) verified",
          detail: "Cross-checked against the tax office database.",
          status: "done",
          dueLabel: "Day 1",
        },
        {
          id: `${emp.code}-T5`,
          step: "paperwork",
          title: "Government ID (KTP) verified",
          detail: "Front and back scanned, matched against HR records.",
          status: "done",
          dueLabel: "Day 1",
        },
        {
          id: `${emp.code}-T6`,
          step: "paperwork",
          title: "Bank account added to payroll",
          detail: "Direct-deposit details saved to the payroll system.",
          status: emp.status === "onboarding" ? "in-progress" : "done",
          dueLabel: "Day 2",
        },
      ],
    },
    {
      id: "uniform",
      label: "Uniform & access",
      description: "Apron, name tag, locker assignment, system access.",
      tasks: [
        {
          id: `${emp.code}-T7`,
          step: "uniform",
          title: "Uniform issued",
          detail: "Two aprons, one name tag, one locker key.",
          status: emp.status === "onboarding" ? "in-progress" : "done",
          dueLabel: "Day 2",
        },
        {
          id: `${emp.code}-T8`,
          step: "uniform",
          title: "POS + scheduling access granted",
          detail: "User role created and shared with outlet lead.",
          status: emp.status === "onboarding" ? "pending" : "done",
          dueLabel: "Day 2",
        },
      ],
    },
    {
      id: "training",
      label: "Training modules",
      description: "Role-specific training and orientation videos.",
      tasks: [
        {
          id: `${emp.code}-T9`,
          step: "training",
          title: "Welcome orientation",
          detail: "30-min intro covering values, schedule, escalation paths.",
          status: emp.status === "onboarding" ? "in-progress" : "done",
          dueLabel: "Week 1",
        },
        {
          id: `${emp.code}-T10`,
          step: "training",
          title: `${emp.role} playbook`,
          detail: "Day-in-the-life walkthrough + SOPs for the role.",
          status: "pending",
          dueLabel: "Week 1",
        },
        {
          id: `${emp.code}-T11`,
          step: "training",
          title: "POS hands-on",
          detail: "Cash handling, voids, refunds, end-of-day reconciliation.",
          status: "pending",
          dueLabel: "Week 2",
        },
      ],
    },
    {
      id: "first-shift",
      label: "First shift",
      description: "Buddy assigned, opening/closing checklist reviewed.",
      tasks: [
        {
          id: `${emp.code}-T12`,
          step: "first-shift",
          title: "Buddy assigned",
          detail: "Pair with an existing team member for opening shift.",
          status: "pending",
          dueLabel: "Week 2",
        },
        {
          id: `${emp.code}-T13`,
          step: "first-shift",
          title: "Shift checklist signed off",
          detail: "Closing checklist reviewed; supervisor sign-off recorded.",
          status: "pending",
          dueLabel: "Week 2",
        },
        {
          id: `${emp.code}-T14`,
          step: "first-shift",
          title: "30-day check-in",
          detail: "One-on-one with outlet lead + People & Culture.",
          status: "pending",
          dueLabel: "Day 30",
        },
      ],
    },
  ];
  return {
    employeeCode: emp.code,
    startedAt: emp.joinedAt,
    expectedCompletionAt: addDays(emp.joinedAt, 30),
    steps,
    activeStepIndex: 3,
  };
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Pick a representative onboarding employee (first onboarding status in roster).
export const ONBOARDING_FLOW: OnboardingFlow = (() => {
  const onboardingEmp =
    EMPLOYEES.find((e) => e.status === "onboarding") ?? EMPLOYEES[0];
  return buildFlow(onboardingEmp);
})();

export function buildOnboardingFlow(emp: Employee): OnboardingFlow {
  return buildFlow(emp);
}

// ---------- Workforce overview (per-outlet headcount + status) ----------

export interface OutletHeadcount {
  outletId: OutletId;
  outletName: string;
  active: number;
  onboarding: number;
  offboarding: number;
  onLeave: number;
  total: number;
}

export const OUTLET_HEADCOUNT: OutletHeadcount[] = OUTLETS.map((o) => {
  const rows = EMPLOYEES.filter((e) => e.outletId === o.id);
  return {
    outletId: o.id,
    outletName: o.name,
    active: rows.filter((r) => r.status === "active").length,
    onboarding: rows.filter((r) => r.status === "onboarding").length,
    offboarding: rows.filter((r) => r.status === "offboarding").length,
    onLeave: rows.filter((r) => r.status === "on-leave").length,
    total: rows.length,
  };
});

export interface DepartmentHeadcount {
  department: Department;
  count: number;
}

export const DEPARTMENT_HEADCOUNT: DepartmentHeadcount[] = DEPARTMENTS.map(
  (d) => ({
    department: d,
    count: EMPLOYEES.filter((e) => e.department === d).length,
  }),
).sort((a, b) => b.count - a.count);

export const WORKFORCE_TOTALS = {
  headcount: EMPLOYEES.length,
  active: EMPLOYEES.filter((e) => e.status === "active").length,
  onboarding: EMPLOYEES.filter((e) => e.status === "onboarding").length,
  offboarding: EMPLOYEES.filter((e) => e.status === "offboarding").length,
  onLeave: EMPLOYEES.filter((e) => e.status === "on-leave").length,
  avgTenureMonths:
    Math.round(
      (EMPLOYEES.reduce((s, e) => s + e.tenureMonths, 0) /
        Math.max(1, EMPLOYEES.length)) *
        10,
    ) / 10,
};

// Re-export OUTLETS so screens that want to render the list of outlets don't
// need to import directly from the shared fixtures.
export { OUTLETS };

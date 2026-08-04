# People & Culture

A UI-only prototype of the PeopleOS workforce platform. The demo recreates
the indigo-600 brand identity, glass top bar, 256px collapsible sidebar
with a 3px indigo left-bar on the active row, and 12/16px rounded
surfaces of the production app from scratch.

Four screens let a visitor walk the lifecycle from directory browse
through onboarding:

- **Directory** — 60-employee roster with status filter pills (all /
  active / onboarding / offboarding / on leave), a free-text search,
  outlet and department filter dropdowns, and a clickable table with
  avatars, role + department, employment type, and join date. Clicking
  a row opens the per-employee record.
- **EmployeeRecord** — single employee view with chips for role /
  status / outlet / employment type, KPI strip (tenure, last active,
  document count, pay), four sections (Personal, Employment, Pay,
  Onboarding), a pay history list, and a documents sidebar listing the
  synthetic file set with category + status pills.
- **OnboardingFlow** — 5-step wizard (offer → paperwork → uniform →
  training → first shift). Stepper on the left, detail panel on the
  right; tasks can be marked done / in-progress / pending, and
  "Send to next step" advances the wizard. A progress bar in the
  header shows overall completion.
- **WorkforceOverview** — stat tiles + per-outlet headcount with
  active / onboarding / offboarding / on-leave counts, status mix
  and department mix panels, a 30-day headcount trend sparkline, and
  an "upcoming this week" list (birthdays, anniversaries, kickoffs).

Every label, ID, employee code, and outlet code is a generic
placeholder. No real people data, third-party SDKs, environment
variables, or `fetch()` calls appear here. State lives entirely in
component state.

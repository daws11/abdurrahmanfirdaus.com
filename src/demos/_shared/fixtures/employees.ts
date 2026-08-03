// src/demos/_shared/fixtures/employees.ts
//
// Synthetic employee fixtures. Per-app plans extend with richer data.

export type EmployeeStatus = "active" | "onboarding" | "offboarding";
export interface Employee {
  id: string; code: string; name: string; role: string; outletId: string;
  joinedAt: string; status: EmployeeStatus;
}
export const EMPLOYEES: Employee[] = [];

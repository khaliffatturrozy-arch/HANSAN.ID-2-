/** Workforce repository ports (Phase A6). */

export interface EmployeeRecord {
  id: string;
  tenantId: string;
  userId: string | null;
  name: string;
  role: string;
  active: boolean;
}

export interface ShiftRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  dateIso: string;
  /** Minutes from local midnight, e.g. 540 = 09:00. */
  startMinute: number;
  endMinute: number;
  graceMinutes: number;
}

export type AttendanceStatus =
  | "scheduled"
  | "on_time"
  | "late"
  | "absent"
  | "clocked_out"
  | "left_early";

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  shiftId: string;
  dateIso: string;
  clockInIso: string | null;
  clockOutIso: string | null;
  status: AttendanceStatus;
}

export interface WorkforcePort {
  getEmployee(id: string): Promise<EmployeeRecord | null>;
  listEmployees(tenantId: string): Promise<EmployeeRecord[]>;
  getShift(id: string): Promise<ShiftRecord | null>;
  saveAttendance(a: AttendanceRecord): Promise<void>;
  getAttendance(shiftId: string): Promise<AttendanceRecord | null>;
}

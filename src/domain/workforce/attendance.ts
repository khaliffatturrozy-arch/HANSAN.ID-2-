/**
 * Attendance rules (Phase A6) — clock-in/out state machine with grace
 * period and lateness computation. Times are minutes-from-midnight in
 * the outlet's local timezone; dates are YYYY-MM-DD.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { AttendanceRecord, AttendanceStatus, ShiftRecord } from "@/domain/workforce/ports";

/** scheduled → attended outcomes → terminal. */
export const ATTENDANCE_TRANSITIONS: Readonly<Record<AttendanceStatus, readonly AttendanceStatus[]>> = {
  scheduled: ["on_time", "late", "absent"],
  on_time: ["clocked_out", "left_early"],
  late: ["clocked_out", "left_early"],
  absent: [],
  clocked_out: [],
  left_early: [],
};

export function canTransitionAttendance(from: AttendanceStatus, to: AttendanceStatus): boolean {
  return ATTENDANCE_TRANSITIONS[from].includes(to);
}

export function assertAttendanceTransition(from: AttendanceStatus, to: AttendanceStatus): void {
  if (!canTransitionAttendance(from, to)) {
    throw new AppError(ERROR_CODES.ATTENDANCE_TRANSITION_INVALID, {
      message: `Attendance cannot move from ${from} to ${to}`,
    });
  }
}

/** Convert an ISO datetime to local minutes-from-midnight (null if invalid). */
export function minutesOfDay(iso: string): number | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.getHours() * 60 + date.getMinutes();
}

export interface ClockInOutcome {
  status: "on_time" | "late";
  lateMinutes: number;
}

/**
 * Clock-in evaluation: on_time when ≤ start + grace; otherwise late.
 * Before shift start − 0 minutes is still on_time (early arrival OK).
 */
export function evaluateClockIn(shift: ShiftRecord, clockInIso: string): Result<ClockInOutcome, AppError> {
  const minute = minutesOfDay(clockInIso);
  if (minute === null) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Invalid clock-in time" }));
  }
  const cutoff = shift.startMinute + Math.max(0, shift.graceMinutes);
  if (minute <= cutoff) return ok({ status: "on_time", lateMinutes: 0 });
  return ok({ status: "late", lateMinutes: minute - shift.startMinute });
}

export interface ClockOutOutcome {
  status: "clocked_out" | "left_early";
  earlyMinutes: number;
}

/** Clock-out evaluation: left_early when before scheduled end. */
export function evaluateClockOut(shift: ShiftRecord, clockOutIso: string): Result<ClockOutOutcome, AppError> {
  const minute = minutesOfDay(clockOutIso);
  if (minute === null) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Invalid clock-out time" }));
  }
  if (minute < shift.endMinute) {
    return ok({ status: "left_early", earlyMinutes: shift.endMinute - minute });
  }
  return ok({ status: "clocked_out", earlyMinutes: 0 });
}

/** Absence check: no clock-in by end of shift (called after shift end). */
export function evaluateAbsence(shift: ShiftRecord, nowIso: string): boolean {
  const nowMinute = minutesOfDay(nowIso);
  return nowMinute !== null && nowMinute > shift.endMinute;
}

export function validateClockIn(record: AttendanceRecord, shift: ShiftRecord, nowIso: string): Result<AttendanceRecord, AppError> {
  const outcome = evaluateClockIn(shift, nowIso);
  if (!outcome.ok) return outcome;
  assertAttendanceTransition(record.status, outcome.value.status);
  return ok({
    ...record,
    clockInIso: nowIso,
    status: outcome.value.status,
  });
}

export function validateClockOut(record: AttendanceRecord, shift: ShiftRecord, nowIso: string): Result<AttendanceRecord, AppError> {
  if (!record.clockInIso) {
    return err(new AppError(ERROR_CODES.ATTENDANCE_TRANSITION_INVALID, { message: "Cannot clock out before clock-in" }));
  }
  const outcome = evaluateClockOut(shift, nowIso);
  if (!outcome.ok) return outcome;
  assertAttendanceTransition(record.status, outcome.value.status);
  return ok({ ...record, clockOutIso: nowIso, status: outcome.value.status });
}

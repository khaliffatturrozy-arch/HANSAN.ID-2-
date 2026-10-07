/**
 * WorkforceService (Phase A6) — scheduled attendance lifecycle over
 * ports: start shift → clock in → clock out, plus performance views.
 * Optional FaceRecognitionPort used ONLY when configured; a manual
 * fallback path always exists (no device lockout).
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { createId } from "@/domain/shared/ids";
import { AUDIT_ACTIONS, type AuditLogPort } from "@/domain/audit/events";
import type { AttendanceRecord, WorkforcePort } from "@/domain/workforce/ports";
import {
  evaluateAbsence,
  validateClockIn,
  validateClockOut,
} from "@/domain/workforce/attendance";
import { computePerformance, type PerformanceReport } from "@/domain/workforce/performance";

export interface WorkforceServiceDeps {
  workforce: WorkforcePort;
  audit: AuditLogPort;
  clock: () => Date;
  face?: import("@/domain/workforce/performance").FaceRecognitionPort;
}

export class WorkforceService {
  constructor(private readonly deps: WorkforceServiceDeps) {}

  /** Create/reset the day's attendance row for a shift (scheduled). */
  async openShift(shiftId: string): Promise<AttendanceRecord> {
    const shift = await this.deps.workforce.getShift(shiftId);
    if (!shift) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Shift not found" });
    const existing = await this.deps.workforce.getAttendance(shiftId);
    if (existing) return existing;
    const record: AttendanceRecord = {
      id: createId("aud"),
      tenantId: shift.tenantId,
      employeeId: shift.employeeId,
      shiftId: shift.id,
      dateIso: shift.dateIso,
      clockInIso: null,
      clockOutIso: null,
      status: "scheduled",
    };
    await this.deps.workforce.saveAttendance(record);
    return record;
  }

  async clockIn(shiftId: string): Promise<AttendanceRecord> {
    const shift = await this.deps.workforce.getShift(shiftId);
    if (!shift) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Shift not found" });
    const record = await this.openShift(shiftId);
    const nowIso = this.deps.clock().toISOString();

    // Face path is OPTIONAL and only active when a provider exists;
    // otherwise the manual/time-clock path proceeds (fallback).
    if (this.deps.face && this.deps.face.status() === "connected") {
      // Provider matching happens at the edge; descriptor arrives with
      // the request. This service never stores biometric material.
    }

    const next = validateClockIn(record, shift, nowIso);
    if (!next.ok) throw next.error;
    await this.deps.workforce.saveAttendance(next.value);
    await this.deps.audit.record({
      id: createId("aud"),
      action: AUDIT_ACTIONS.ATTENDANCE_CLOCK_IN,
      actorId: shift.employeeId,
      actorRole: "system",
      entityType: "attendance",
      entityId: next.value.id,
      tenantId: shift.tenantId,
      occurredAt: nowIso,
      metadata: { status: next.value.status },
    });
    return next.value;
  }

  async clockOut(shiftId: string): Promise<AttendanceRecord> {
    const shift = await this.deps.workforce.getShift(shiftId);
    if (!shift) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Shift not found" });
    const record = await this.deps.workforce.getAttendance(shiftId);
    if (!record) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "No attendance record for shift" });
    const nowIso = this.deps.clock().toISOString();
    const next = validateClockOut(record, shift, nowIso);
    if (!next.ok) throw next.error;
    await this.deps.workforce.saveAttendance(next.value);
    await this.deps.audit.record({
      id: createId("aud"),
      action: AUDIT_ACTIONS.ATTENDANCE_CLOCK_OUT,
      actorId: shift.employeeId,
      actorRole: "system",
      entityType: "attendance",
      entityId: next.value.id,
      tenantId: shift.tenantId,
      occurredAt: nowIso,
      metadata: { status: next.value.status },
    });
    return next.value;
  }

  /** Mark absence for shifts that ended with no clock-in (sweep job). */
  async markAbsentIfDue(shiftId: string): Promise<AttendanceRecord | null> {
    const shift = await this.deps.workforce.getShift(shiftId);
    if (!shift) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Shift not found" });
    const record = await this.deps.workforce.getAttendance(shiftId);
    if (!record || record.status !== "scheduled") return record ?? null;
    const nowIso = this.deps.clock().toISOString();
    if (!evaluateAbsence(shift, nowIso)) return record;
    const updated: AttendanceRecord = { ...record, status: "absent" };
    await this.deps.workforce.saveAttendance(updated);
    return updated;
  }

  async performanceFor(employeeId: string, records: { status: string; clockInIso: string | null }[]): Promise<PerformanceReport> {
    void employeeId;
    return computePerformance(records);
  }
}
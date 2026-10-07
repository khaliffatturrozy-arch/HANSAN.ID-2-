/**
 * Performance + biometric interface (Phase A6).
 * - Performance derives ONLY from stored attendance records.
 * - Face recognition: INTERFACE ONLY. No biometric data is stored,
 *   no vendor is fabricated; adapter reports not_configured until a
 *   real, privacy-reviewed provider exists.
 */

// ---------- performance ----------
export interface AttendanceMetrics {
  scheduled: number;
  attended: number;
  onTime: number;
  late: number;
  leftEarly: number;
  absent: number;
  totalLateMinutes: number;
}

export interface PerformanceThresholds {
  /** Late rate above this share triggers a warning. */
  lateRateWarning: number;
}

export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = { lateRateWarning: 0.2 };

export interface PerformanceReport {
  metrics: AttendanceMetrics;
  punctualityRate: number; // 0..1, 0 when no records
  attendanceRate: number; // 0..1, 0 when no records
  warning: boolean;
  warningReason: string | null;
}

export function computeAttendanceMetrics(records: { status: string; clockInIso: string | null }[]): AttendanceMetrics {
  const m: AttendanceMetrics = {
    scheduled: records.length,
    attended: 0,
    onTime: 0,
    late: 0,
    leftEarly: 0,
    absent: 0,
    totalLateMinutes: 0,
  };
  for (const r of records) {
    switch (r.status) {
      case "on_time":
        m.attended += 1;
        m.onTime += 1;
        break;
      case "late":
        m.attended += 1;
        m.late += 1;
        break;
      case "clocked_out":
        m.attended += 1;
        break;
      case "left_early":
        m.attended += 1;
        m.leftEarly += 1;
        break;
      case "absent":
        m.absent += 1;
        break;
      default:
        break;
    }
  }
  return m;
}

export function computePerformance(
  records: { status: string; clockInIso: string | null; shiftStartMinute?: number }[],
  thresholds: PerformanceThresholds = DEFAULT_PERFORMANCE_THRESHOLDS,
): PerformanceReport {
  const metrics = computeAttendanceMetrics(records);
  const punctualityRate = metrics.attended > 0 ? metrics.onTime / metrics.attended : 0;
  const attendanceRate = metrics.scheduled > 0 ? metrics.attended / metrics.scheduled : 0;
  const lateRate = metrics.attended > 0 ? metrics.late / metrics.attended : 0;
  const warning = metrics.attended > 0 && lateRate > thresholds.lateRateWarning;
  return {
    metrics,
    punctualityRate: Number.isFinite(punctualityRate) ? punctualityRate : 0,
    attendanceRate: Number.isFinite(attendanceRate) ? attendanceRate : 0,
    warning,
    warningReason: warning
      ? `Late rate ${(lateRate * 100).toFixed(0)}% exceeds threshold ${(thresholds.lateRateWarning * 100).toFixed(0)}%`
      : null,
  };
}

// ---------- face recognition (interface only) ----------
export interface FaceMatchResult {
  matched: boolean;
  confidence: number;
}

/**
 * Ephemeral matching port. Implementations MUST:
 * - process frames in memory only,
 * - never persist raw images or embeddings without explicit,
 *   audited biometric consent + encryption (out of scope until then),
 * - report honest status. There is NO default implementation.
 */
export interface FaceRecognitionPort {
  /** Honest capability status shown in UI/docs. */
  status(): "connected" | "disconnected" | "pending_setup" | "not_configured" | "error";
  /** Verify a clock-in frame against a stored reference (future). */
  matchForClockIn(employeeId: string, frameDescriptor: Uint8Array): Promise<FaceMatchResult>;
}

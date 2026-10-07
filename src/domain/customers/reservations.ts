/**
 * Reservations (Phase A7) — lifecycle state machine, capacity rules,
 * table/floor assignment, and overlap-based availability.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { ReservationRecord, TableRecord } from "@/domain/customers/ports";

export const RESERVATION_TRANSITIONS: Readonly<Record<ReservationRecord["status"], readonly ReservationRecord["status"][]>> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["seated", "cancelled", "no_show"],
  seated: ["completed"],
  completed: [],
  cancelled: [],
  no_show: [],
};

export function canTransitionReservation(from: ReservationRecord["status"], to: ReservationRecord["status"]): boolean {
  return RESERVATION_TRANSITIONS[from].includes(to);
}

export function assertReservationTransition(from: ReservationRecord["status"], to: ReservationRecord["status"]): void {
  if (!canTransitionReservation(from, to)) {
    throw new AppError(ERROR_CODES.RESERVATION_TRANSITION_INVALID, {
      message: `Reservation cannot move from ${from} to ${to}`,
    });
  }
}

/** Statuses that occupy a table (block overlapping bookings). */
export const OCCUPYING_STATUSES: readonly ReservationRecord["status"][] = ["pending", "confirmed", "seated"];

export function validateGuestCount(guestCount: number): Result<true, AppError> {
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 500) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Guest count must be 1–500" }));
  }
  return ok(true);
}

export function validateTableForReservation(table: TableRecord, guestCount: number): Result<true, AppError> {
  if (!table.active) {
    return err(new AppError(ERROR_CODES.SLOT_UNAVAILABLE, { message: "Table is inactive" }));
  }
  if (table.capacity < guestCount) {
    return err(new AppError(ERROR_CODES.TABLE_CAPACITY_EXCEEDED, {
      message: `Table capacity ${table.capacity} < guests ${guestCount}`,
    }));
  }
  return ok(true);
}

export interface TimeWindow {
  startAt: string;
  endAt: string;
}

/** Half-open interval overlap: [aStart, aEnd) ∩ [bStart, bEnd) ≠ ∅. */
export function windowsOverlap(a: TimeWindow, b: TimeWindow): boolean {
  const aS = Date.parse(a.startAt);
  const aE = Date.parse(a.endAt);
  const bS = Date.parse(b.startAt);
  const bE = Date.parse(b.endAt);
  if ([aS, aE, bS, bE].some((t) => Number.isNaN(t))) return false;
  return aS < bE && bS < aE;
}

/**
 * Availability: no other occupying reservation on the same table with
 * an overlapping window. Without a table, check floor-level capacity
 * conflicts is deferred to operator review (tableId null = open slot).
 */
export function validateAvailability(
  candidate: { tableId: string | null; startAt: string; endAt: string; status: ReservationRecord["status"] },
  existing: ReservationRecord[],
  excludeId?: string,
): Result<true, AppError> {
  if (!candidate.tableId) return ok(true);
  for (const r of existing) {
    if (excludeId && r.id === excludeId) continue;
    if (r.tableId !== candidate.tableId) continue;
    if (!OCCUPYING_STATUSES.includes(r.status)) continue;
    if (windowsOverlap(candidate, r)) {
      return err(new AppError(ERROR_CODES.SLOT_UNAVAILABLE, { message: "Table already booked for this time" }));
    }
  }
  return ok(true);
}

export function validateWindow(window: TimeWindow): Result<true, AppError> {
  const s = Date.parse(window.startAt);
  const e = Date.parse(window.endAt);
  if (Number.isNaN(s) || Number.isNaN(e)) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Invalid reservation times" }));
  }
  if (e <= s) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "End time must be after start time" }));
  }
  if (e - s > 86_400_000) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Reservation window cannot exceed 24h" }));
  }
  return ok(true);
}

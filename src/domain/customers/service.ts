/**
 * CustomerService (Phase A7) — customer registration, reservation
 * lifecycle with capacity+availability enforcement, loyalty accrual.
 * No records are ever fabricated; lists start empty.
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { createId } from "@/domain/shared/ids";
import type {
  CustomerPort,
  CustomerRecord,
  ReservationPort,
  ReservationRecord,
  TablePort,
} from "@/domain/customers/ports";
import {
  assertReservationTransition,
  validateAvailability,
  validateGuestCount,
  validateTableForReservation,
  validateWindow,
} from "@/domain/customers/reservations";
import { pointsForOrder, tierForPoints, type LoyaltyConfig, DEFAULT_LOYALTY } from "@/domain/customers/loyalty";

export interface CustomerServiceDeps {
  customers: CustomerPort;
  reservations: ReservationPort;
  tables: TablePort;
  clock: () => Date;
  loyalty?: LoyaltyConfig;
}

export class CustomerService {
  constructor(private readonly deps: CustomerServiceDeps) {}

  async registerCustomer(params: {
    tenantId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
  }): Promise<CustomerRecord> {
    const name = params.name.trim();
    if (name.length < 1 || name.length > 120) {
      throw new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Customer name must be 1–120 chars" });
    }
    if (!params.email && !params.phone) {
      throw new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Email or phone required" });
    }
    const customer: CustomerRecord = {
      id: createId("cus"),
      tenantId: params.tenantId,
      name,
      email: params.email?.trim().toLowerCase() ?? null,
      phone: params.phone?.trim() ?? null,
      loyaltyPoints: 0,
      membershipTier: "none",
      createdAt: this.deps.clock().toISOString(),
    };
    await this.deps.customers.saveCustomer(customer);
    return customer;
  }

  async createReservation(params: {
    tenantId: string;
    outletId: string;
    customerId: string | null;
    guestCount: number;
    tableId: string | null;
    floorId: string;
    startAt: string;
    endAt: string;
    note?: string | null;
  }): Promise<ReservationRecord> {
    const guests = validateGuestCount(params.guestCount);
    if (!guests.ok) throw guests.error;
    const window = validateWindow({ startAt: params.startAt, endAt: params.endAt });
    if (!window.ok) throw window.error;

    if (params.tableId) {
      const table = await this.deps.tables.getTable(params.tableId);
      if (!table || table.tenantId !== params.tenantId) {
        throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Table not found" });
      }
      const fits = validateTableForReservation(table, params.guestCount);
      if (!fits.ok) throw fits.error;
      if (table.floorId !== params.floorId) {
        throw new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Table does not belong to floor" });
      }
    }

    const dayIso = params.startAt.slice(0, 10);
    const existing = await this.deps.reservations.listByDay(params.outletId, dayIso);
    const availability = validateAvailability(
      { tableId: params.tableId, startAt: params.startAt, endAt: params.endAt, status: "pending" },
      existing,
    );
    if (!availability.ok) throw availability.error;

    const reservation: ReservationRecord = {
      id: createId("rsv"),
      tenantId: params.tenantId,
      outletId: params.outletId,
      customerId: params.customerId,
      guestCount: params.guestCount,
      tableId: params.tableId,
      floorId: params.floorId,
      startAt: params.startAt,
      endAt: params.endAt,
      status: "pending",
      note: params.note ?? null,
      createdAt: this.deps.clock().toISOString(),
    };
    await this.deps.reservations.saveReservation(reservation);
    return reservation;
  }

  async transitionReservation(
    id: string,
    to: ReservationRecord["status"],
    options: { reassignTableId?: string; guestCount?: number } = {},
  ): Promise<ReservationRecord> {
    const reservation = await this.deps.reservations.getReservation(id);
    if (!reservation) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Reservation not found" });
    assertReservationTransition(reservation.status, to);

    let updated: ReservationRecord = { ...reservation, status: to };

    if (to === "seated") {
      const tableId = options.reassignTableId ?? reservation.tableId;
      const guestCount = options.guestCount ?? reservation.guestCount;
      if (tableId) {
        const table = await this.deps.tables.getTable(tableId);
        if (!table) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Table not found" });
        const fits = validateTableForReservation(table, guestCount);
        if (!fits.ok) throw fits.error;
      }
      updated = { ...updated, tableId, guestCount };
    }

    await this.deps.reservations.saveReservation(updated);
    return updated;
  }

  /** Accrue loyalty points from a real completed order total. */
  async accruePoints(customerId: string, grandTotalIdr: number): Promise<CustomerRecord> {
    const customer = await this.deps.customers.getCustomer(customerId);
    if (!customer) throw new AppError(ERROR_CODES.NOT_FOUND, { message: "Customer not found" });
    const earned = pointsForOrder(grandTotalIdr, this.deps.loyalty ?? DEFAULT_LOYALTY);
    const updated: CustomerRecord = {
      ...customer,
      loyaltyPoints: customer.loyaltyPoints + earned,
      membershipTier: tierForPoints(customer.loyaltyPoints + earned),
    };
    await this.deps.customers.saveCustomer(updated);
    return updated;
  }
}

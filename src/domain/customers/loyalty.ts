/**
 * Loyalty (Phase A7) — points earning, membership tiers, vouchers,
 * discounts/promotions, rewards, leaderboard. Pure rules over real
 * records; empty inputs produce empty/zero results (§4).
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";
import { err, ok, type Result } from "@/domain/shared/result";
import type { CustomerRecord, VoucherRecord } from "@/domain/customers/ports";

// ---------- points ----------
export interface LoyaltyConfig {
  /** Rupiah spent per 1 point (e.g. 10_000 = 1 point per Rp 10.000). */
  rupiahPerPoint: number;
}

export const DEFAULT_LOYALTY: LoyaltyConfig = { rupiahPerPoint: 10_000 };

/** Points earned from a completed order total (floored, never negative). */
export function pointsForOrder(grandTotalIdr: number, config: LoyaltyConfig = DEFAULT_LOYALTY): number {
  if (!Number.isFinite(grandTotalIdr) || grandTotalIdr <= 0) return 0;
  if (config.rupiahPerPoint <= 0) return 0;
  return Math.floor(grandTotalIdr / config.rupiahPerPoint);
}

export function redeemCost(points: number): Result<number, AppError> {
  if (!Number.isInteger(points) || points <= 0) {
    return err(new AppError(ERROR_CODES.VALIDATION_FAILED, { message: "Points must be a positive integer" }));
  }
  return ok(points);
}

// ---------- tiers ----------
export const TIER_THRESHOLDS: Readonly<Record<"silver" | "gold" | "platinum", number>> = {
  silver: 100,
  gold: 500,
  platinum: 2000,
};

export function tierForPoints(points: number): CustomerRecord["membershipTier"] {
  if (points >= TIER_THRESHOLDS.platinum) return "platinum";
  if (points >= TIER_THRESHOLDS.gold) return "gold";
  if (points >= TIER_THRESHOLDS.silver) return "silver";
  return "none";
}

// ---------- leaderboard ----------
export interface LeaderboardEntry {
  customerId: string;
  name: string;
  points: number;
  rank: number;
}

/** Top customers by points; stable sort, empty input ⇒ empty list. */
export function leaderboard(customers: CustomerRecord[], limit = 10): LeaderboardEntry[] {
  return [...customers]
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints || a.name.localeCompare(b.name))
    .slice(0, Math.max(1, limit))
    .map((c, index) => ({ customerId: c.id, name: c.name, points: c.loyaltyPoints, rank: index + 1 }));
}

// ---------- vouchers / discounts ----------
export interface OrderDiscountInput {
  subtotalIdr: number;
  voucher: VoucherRecord | null;
  voucherCodeUsed?: string;
}

export interface AppliedDiscount {
  source: "voucher";
  code: string;
  amountIdr: number;
}

/** Apply a voucher: validated against active/expiry/usage (one per order). */
export function applyVoucher(input: OrderDiscountInput, now: Date): Result<AppliedDiscount, AppError> {
  const { voucher, subtotalIdr } = input;
  if (!voucher) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "No voucher supplied" }));
  }
  if (!voucher.active) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Voucher is inactive" }));
  }
  if (voucher.expiresAt && Date.parse(voucher.expiresAt) < now.getTime()) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Voucher expired" }));
  }
  if (voucher.usedCount >= voucher.usageLimit) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Voucher usage limit reached" }));
  }
  if (subtotalIdr <= 0) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Nothing to discount" }));
  }

  let amount: number;
  if (voucher.kind === "percent") {
    if (voucher.value <= 0 || voucher.value > 100) {
      return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Invalid voucher percentage" }));
    }
    amount = Math.round((subtotalIdr * voucher.value) / 100);
  } else {
    if (!Number.isInteger(voucher.value) || voucher.value <= 0) {
      return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Invalid voucher amount" }));
    }
    amount = voucher.value;
  }
  amount = Math.min(amount, subtotalIdr);
  return ok({ source: "voucher", code: voucher.code, amountIdr: amount });
}

// ---------- rewards ----------
export interface RewardDefinition {
  id: string;
  name: string;
  pointsCost: number;
  active: boolean;
}

export function canRedeemReward(customer: CustomerRecord, reward: RewardDefinition): Result<true, AppError> {
  if (!reward.active) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Reward is not active" }));
  }
  if (customer.loyaltyPoints < reward.pointsCost) {
    return err(new AppError(ERROR_CODES.VOUCHER_INVALID, { message: "Insufficient points" }));
  }
  return ok(true);
}

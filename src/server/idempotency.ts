/**
 * Idempotency port (Phase 4) — replay protection for unsafe operations
 * (POST /api/orders and friends).
 *
 * Contract:
 *   begin()  — atomically claims the (scope, key). Returns:
 *              "started"  first request, caller may execute;
 *              "replay"   a completed result exists, return it verbatim;
 *              "conflict" an execution is in flight (or hash mismatch), reject.
 *   complete() — stores the response for future replays.
 *   fail()     — releases the claim so a retry can execute.
 *
 * The Prisma adapter backs this with the unique constraint on
 * (organizationId, scope, key) — concurrent duplicates cannot start.
 * The in-memory adapter is for tests/dev only (per-instance).
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";

export type BeginResult =
  | { status: "started"; recordId: string }
  | { status: "replay"; response: unknown }
  | { status: "conflict" };

export interface IdempotencyPort {
  begin(params: {
    organizationId: string;
    scope: string;
    key: string;
    requestHash: string;
    ttlSeconds?: number;
  }): Promise<BeginResult>;
  complete(params: { organizationId: string; scope: string; key: string; response: unknown }): Promise<void>;
  fail(params: { organizationId: string; scope: string; key: string }): Promise<void>;
}

export const DEFAULT_IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;

/** Test/dev adapter — single process only. Production uses PrismaIdempotency. */
export class InMemoryIdempotency implements IdempotencyPort {
  private rows = new Map<string, { hash: string; status: "in_progress" | "completed"; response: unknown; expiresAt: number }>();

  private id(p: { organizationId: string; scope: string; key: string }): string {
    return `${p.organizationId}::${p.scope}::${p.key}`;
  }

  async begin(params: {
    organizationId: string;
    scope: string;
    key: string;
    requestHash: string;
    ttlSeconds?: number;
  }): Promise<BeginResult> {
    const id = this.id(params);
    const existing = this.rows.get(id);
    const now = Date.now();
    if (existing && existing.expiresAt > now) {
      if (existing.hash !== params.requestHash) return { status: "conflict" };
      if (existing.status === "completed") return { status: "replay", response: existing.response };
      return { status: "conflict" };
    }
    this.rows.set(id, {
      hash: params.requestHash,
      status: "in_progress",
      response: null,
      expiresAt: now + (params.ttlSeconds ?? DEFAULT_IDEMPOTENCY_TTL_SECONDS) * 1000,
    });
    return { status: "started", recordId: id };
  }

  async complete(params: { organizationId: string; scope: string; key: string; response: unknown }): Promise<void> {
    const id = this.id(params);
    const existing = this.rows.get(id);
    if (existing) {
      existing.status = "completed";
      existing.response = params.response;
    }
  }

  async fail(params: { organizationId: string; scope: string; key: string }): Promise<void> {
    this.rows.delete(this.id(params));
  }
}

/** Canonical request hash (sha256 hex) for replay comparison. */
export async function requestHash(body: unknown): Promise<string> {
  const canonical = JSON.stringify(body, Object.keys(body as Record<string, unknown>).sort());
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Throw CONFLICT when begin() cannot proceed. */
export function assertStarted(result: BeginResult): asserts result is { status: "started"; recordId: string } {
  if (result.status !== "started") {
    throw new AppError(ERROR_CODES.CONFLICT, { message: "Duplicate request for this Idempotency-Key" });
  }
}

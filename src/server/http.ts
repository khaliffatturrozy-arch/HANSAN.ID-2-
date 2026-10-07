/**
 * HTTP helpers for route handlers — consistent envelopes, status
 * mapping, and a safe error serializer (never leaks internals).
 */
import { NextResponse } from "next/server";
import { apiFail, apiOk, type ApiResponse } from "@/domain/shared/api-contract";
import { AppError, ERROR_CODES, isAppError, toAppError, type ErrorCode } from "@/domain/shared/errors";
import type { Issue } from "@/domain/shared/validation";

export function jsonOk<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(apiOk(data), { status });
}

export function jsonFail(code: ErrorCode | string, message: string, status: number, issues?: Issue[]): NextResponse<ApiResponse<never>> {
  return NextResponse.json(apiFail(code, message, issues), { status });
}

export function jsonError(error: unknown): NextResponse<ApiResponse<never>> {
  const appError: AppError = toAppError(error);
  // Generic internal errors: log server-side, return safe message only.
  if (appError.status >= 500 && !isAppError(error)) {
    console.error("[api]", appError.code, appError.message);
  }
  if (isAppError(error) && error.status >= 500) {
    console.error("[api]", error.code, error);
  }
  return jsonFail(appError.code, appError.status >= 500 ? "Internal error" : appError.message, appError.status, appError.details);
}

/** Guard: throws UNAUTHENTICATED when no identity present (Phase 13 wires real sessions). */
export interface RequestIdentity {
  userId: string;
  role: string;
  tenantId?: string;
  outletId?: string;
}

export function requireIdentity(identity: RequestIdentity | null): RequestIdentity {
  if (!identity) throw new AppError(ERROR_CODES.UNAUTHENTICATED);
  return identity;
}

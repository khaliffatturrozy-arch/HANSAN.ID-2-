/**
 * Typed API responses — every route handler returns this envelope so
 * clients can branch on `ok` without parsing errors ad hoc (Phase A1).
 */
import type { Issue } from "./validation";

export interface ApiOk<T> {
  readonly ok: true;
  readonly data: T;
}

export interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
  readonly issues?: Issue[];
}

export interface ApiFail {
  readonly ok: false;
  readonly error: ApiErrorBody;
}

export type ApiResponse<T> = ApiOk<T> | ApiFail;

export function apiOk<T>(data: T): ApiOk<T> {
  return { ok: true, data };
}

export function apiFail(code: string, message: string, issues?: Issue[]): ApiFail {
  return { ok: false, error: issues ? { code, message, issues } : { code, message } };
}

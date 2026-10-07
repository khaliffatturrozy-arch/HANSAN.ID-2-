/**
 * Honest not-configured adapter — the default persistence stand-in
 * until real adapters are wired. Every call throws
 * PERSISTENCE_NOT_CONFIGURED; it can never fabricate records (§4).
 */
import { AppError, ERROR_CODES } from "@/domain/shared/errors";

export function notConfigured<T extends object>(): T {
  return new Proxy<T>({} as T, {
    get(_target, prop) {
      if (prop === "then") return undefined; // not a thenable
      return () =>
        Promise.reject(
          new AppError(ERROR_CODES.PERSISTENCE_NOT_CONFIGURED, {
            message: `Persistence is not configured (port: ${String(prop)})`,
          }),
        );
    },
  });
}

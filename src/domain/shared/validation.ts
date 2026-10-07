/**
 * Validation schemas — dependency-free combinator library.
 * Validators are pure functions: unknown → typed value or issues.
 * (Phase A1; reused by API route handlers and domain constructors.)
 */

export interface Issue {
  path: string;
  message: string;
}

export type Validation<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly issues: Issue[] };

export type Validator<T> = (input: unknown, path?: string) => Validation<T>;

function fail(path: string, message: string): Validation<never> {
  return { ok: false, issues: [{ path, message }] };
}

function pass<T>(value: T): Validation<T> {
  return { ok: true, value };
}

export function validate<T>(validator: Validator<T>, input: unknown): Validation<T> {
  return validator(input, "$");
}

export interface StringOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export function string(options: StringOptions = {}): Validator<string> {
  return (input, path = "$") => {
    if (typeof input !== "string") return fail(path, "Expected string");
    if (options.minLength !== undefined && input.length < options.minLength) {
      return fail(path, `Must be at least ${options.minLength} characters`);
    }
    if (options.maxLength !== undefined && input.length > options.maxLength) {
      return fail(path, `Must be at most ${options.maxLength} characters`);
    }
    if (options.pattern && !options.pattern.test(input)) {
      return fail(path, "Does not match required format");
    }
    return pass(input);
  };
}

export interface IntOptions {
  min?: number;
  max?: number;
}

/** Integer amounts (rupiah, quantities, points) — never floats. */
export function int(options: IntOptions = {}): Validator<number> {
  return (input, path = "$") => {
    if (typeof input !== "number" || !Number.isFinite(input)) return fail(path, "Expected number");
    if (!Number.isInteger(input)) return fail(path, "Expected integer");
    if (options.min !== undefined && input < options.min) return fail(path, `Must be >= ${options.min}`);
    if (options.max !== undefined && input > options.max) return fail(path, `Must be <= ${options.max}`);
    return pass(input);
  };
}

export function boolean(): Validator<boolean> {
  return (input, path = "$") => (typeof input === "boolean" ? pass(input) : fail(path, "Expected boolean"));
}

export function oneOf<T extends string | number>(allowed: readonly T[]): Validator<T> {
  return (input, path = "$") =>
    allowed.includes(input as T) ? pass(input as T) : fail(path, `Expected one of: ${allowed.join(", ")}`);
}

export function array<T>(item: Validator<T>, options: { minLength?: number; maxLength?: number } = {}): Validator<T[]> {
  return (input, path = "$") => {
    if (!Array.isArray(input)) return fail(path, "Expected array");
    if (options.minLength !== undefined && input.length < options.minLength) {
      return fail(path, `Must contain at least ${options.minLength} item(s)`);
    }
    if (options.maxLength !== undefined && input.length > options.maxLength) {
      return fail(path, `Must contain at most ${options.maxLength} item(s)`);
    }
    const out: T[] = [];
    const issues: Issue[] = [];
    input.forEach((element, index) => {
      const result = item(element, `${path}[${index}]`);
      if (result.ok) out.push(result.value);
      else issues.push(...result.issues);
    });
    return issues.length > 0 ? { ok: false as const, issues } : pass(out);
  };
}

export type Shape = Record<string, Validator<unknown>>;

/** Validate an object against a shape; strips unknown keys. */
export function object<S extends Shape>(shape: S): Validator<{ [K in keyof S]: S[K] extends Validator<infer U> ? U : never }> {
  type Out = { [K in keyof S]: S[K] extends Validator<infer U> ? U : never };
  return (input, path = "$") => {
    if (typeof input !== "object" || input === null || Array.isArray(input)) return fail(path, "Expected object");
    const record = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    const issues: Issue[] = [];
    for (const key of Object.keys(shape)) {
      const result = shape[key](record[key], `${path}.${key}`);
      if (result.ok) out[key] = result.value;
      else issues.push(...result.issues);
    }
    return issues.length > 0 ? { ok: false as const, issues } : pass(out as Out);
  };
}

export function optional<T>(validator: Validator<T>): Validator<T | undefined> {
  return (input, path = "$") => (input === undefined ? pass(undefined) : validator(input, path));
}

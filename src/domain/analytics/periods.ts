/**
 * Reporting periods (Phase A8) — daily/weekly/monthly/yearly/custom
 * windows + bucket keys for time-series grouping. All math is on UTC
 * timestamps of stored records (no fabricated data points).
 */

export type PeriodKind = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface Period {
  kind: PeriodKind;
  /** Inclusive start (epoch ms). */
  startMs: number;
  /** Exclusive end (epoch ms). */
  endMs: number;
  label: string;
}

const DAY_MS = 86_400_000;

export function buildPeriod(kind: PeriodKind, anchor: Date, custom?: { startMs: number; endMs: number }): Period {
  if (kind === "custom") {
    if (!custom || !Number.isFinite(custom.startMs) || !Number.isFinite(custom.endMs) || custom.endMs <= custom.startMs) {
      throw new Error("Custom period requires a valid {startMs, endMs}");
    }
    return { kind, startMs: custom.startMs, endMs: custom.endMs, label: `${isoDay(custom.startMs)}..${isoDay(custom.endMs - 1)}` };
  }

  const y = anchor.getUTCFullYear();
  const m = anchor.getUTCMonth();
  const d = anchor.getUTCDate();

  if (kind === "daily") {
    const start = Date.UTC(y, m, d);
    return { kind, startMs: start, endMs: start + DAY_MS, label: isoDay(start) };
  }
  if (kind === "weekly") {
    const weekday = (anchor.getUTCDay() + 6) % 7; // Monday = 0
    const start = Date.UTC(y, m, d - weekday);
    return { kind, startMs: start, endMs: start + 7 * DAY_MS, label: `week of ${isoDay(start)}` };
  }
  if (kind === "monthly") {
    const start = Date.UTC(y, m, 1);
    return { kind, startMs: start, endMs: Date.UTC(y, m + 1, 1), label: `${y}-${String(m + 1).padStart(2, "0")}` };
  }
  const start = Date.UTC(y, 0, 1);
  return { kind: "yearly", startMs: start, endMs: Date.UTC(y + 1, 0, 1), label: String(y) };
}

function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function fallsWithin(period: Period, isoTimestamp: string): boolean {
  const t = Date.parse(isoTimestamp);
  if (Number.isNaN(t)) return false;
  return t >= period.startMs && t < period.endMs;
}

export type Granularity = "hour" | "day" | "month";

export function granularityFor(period: Period): Granularity {
  if (period.kind === "daily") return "hour";
  if (period.kind === "yearly") return "month";
  return "day";
}

export function bucketKey(isoTimestamp: string, granularity: Granularity): string {
  const t = Date.parse(isoTimestamp);
  if (Number.isNaN(t)) return "unknown";
  const date = new Date(t);
  if (granularity === "hour") return `${isoDay(t)}T${String(date.getUTCHours()).padStart(2, "0")}:00`;
  if (granularity === "month") return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return isoDay(t);
}

/** Every bucket label inside the period (series skeleton — no values invented). */
export function bucketLabels(period: Period, granularity: Granularity): string[] {
  const labels: string[] = [];
  if (granularity === "hour") {
    for (let t = period.startMs; t < period.endMs; t += 3_600_000) labels.push(bucketKey(new Date(t).toISOString(), "hour"));
    return labels;
  }
  if (granularity === "month") {
    for (let t = period.startMs; t < period.endMs; t += 28 * DAY_MS) {
      const key = bucketKey(new Date(t).toISOString(), "month");
      if (!labels.includes(key)) labels.push(key);
    }
    return labels;
  }
  for (let t = period.startMs; t < period.endMs; t += DAY_MS) labels.push(bucketKey(new Date(t).toISOString(), "day"));
  return labels;
}

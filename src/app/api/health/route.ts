import { NextResponse } from "next/server";

/**
 * Phase 0 health endpoint — honest development states only (§12).
 * External systems are NOT connected; report "not-configured".
 */
export async function GET() {
  return NextResponse.json({
    app: "hansan",
    phase: "Phase 0 — Project Foundation",
    status: "ok",
    integrations: {
      database: "not-configured",
      auth: "development-only-planned",
      payments: "not-configured",
    },
    timestamp: new Date().toISOString(),
  });
}

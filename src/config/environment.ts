/**
 * Configuration boundary — single place that reads process env.
 * NEVER throws at import time (builds run without secrets).
 * Values are accessed lazily via getters; secrets are never logged.
 * (Phase A1; MANUAL-BLOCKERS.md lists required production vars.)
 */

export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  appName: string;
  /** Supabase Auth (Phase 13) — null until configured. */
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  /** Database (deferred) — null until configured. */
  databaseUrl: string | null;
}

function read(name: string): string | null {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : null;
}

export function getConfig(): AppConfig {
  const nodeEnvRaw = read("NODE_ENV") ?? "development";
  return {
    nodeEnv: nodeEnvRaw === "production" ? "production" : nodeEnvRaw === "test" ? "test" : "development",
    appName: read("NEXT_PUBLIC_APP_NAME") ?? "HANSAN",
    supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    databaseUrl: read("DATABASE_URL") ?? read("POSTGRES_URL") ?? read("PRISMA_DATABASE_URL"),
  };
}

export function hasSupabaseAuth(): boolean {
  const c = getConfig();
  return Boolean(c.supabaseUrl && c.supabaseAnonKey);
}

export function hasDatabase(): boolean {
  return Boolean(getConfig().databaseUrl);
}

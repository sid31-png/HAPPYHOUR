/**
 * Reads the Supabase env vars Expo inlines at build time (EXPO_PUBLIC_*).
 * A freshly-scaffolded monorepo may not have a Supabase project provisioned
 * yet, so we treat missing/placeholder values as "not configured" rather
 * than throwing at import time — screens show a friendly French error
 * state instead of a crash.
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

function looksConfigured(value: string): boolean {
  if (!value) return false;
  if (value.includes("xxxx")) return false;
  return true;
}

export const isSupabaseConfigured =
  looksConfigured(SUPABASE_URL) && looksConfigured(SUPABASE_ANON_KEY);

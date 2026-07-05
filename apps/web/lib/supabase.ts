import { createSupabaseClient, type HappyHourClient } from "@happyhour/api";

let cachedClient: HappyHourClient | null | undefined;

/**
 * Lazily builds the browser Supabase client from public env vars.
 * Returns `null` when the project isn't configured yet (e.g. this landing
 * page deployed before a real Supabase project is provisioned) so callers
 * can show a friendly French error instead of crashing.
 */
export function getSupabaseClient(): HappyHourClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cachedClient = null;
    return null;
  }

  cachedClient = createSupabaseClient({ url, anonKey });
  return cachedClient;
}

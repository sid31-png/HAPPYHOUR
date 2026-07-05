import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSupabaseClient, type HappyHourClient } from "@happyhour/api";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

let client: HappyHourClient | null = null;

/**
 * Lazily creates the shared Supabase client. Returns null when the app
 * hasn't been configured with real Supabase credentials yet (see
 * apps/mobile/.env.example) so callers can render a friendly error state
 * instead of crashing.
 */
export function getSupabase(): HappyHourClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createSupabaseClient({
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY,
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

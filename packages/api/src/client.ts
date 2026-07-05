import { createClient, type SupabaseClient, type SupabaseClientOptions } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type HappyHourClient = SupabaseClient<Database>;

export interface CreateSupabaseClientOptions {
  url: string;
  anonKey: string;
  auth?: SupabaseClientOptions<"public">["auth"];
}

export function createSupabaseClient({ url, anonKey, auth }: CreateSupabaseClientOptions): HappyHourClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase URL et anon key sont requis (voir .env.example : SUPABASE_URL / SUPABASE_ANON_KEY)."
    );
  }
  return createClient<Database>(url, anonKey, { auth });
}

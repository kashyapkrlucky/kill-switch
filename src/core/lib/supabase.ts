import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/core/config/env";
import { logger } from "@/core/utils/logger";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseAnonKey = getRequiredEnv("SUPABASE_ANON_KEY");

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    logger.info("Supabase client initialized");
    return supabaseClient;
  } catch (error) {
    logger.error("Failed to create Supabase client", error);
    throw error;
  }
}

type EnvKey =
  | "BREVO_API_KEY"
  | "JWT_SECRET"
  | "MONGODB_URI"
  | "NEXT_PUBLIC_API_URL"
  | "NEXT_PUBLIC_APP_URL"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_URL";

export function getRequiredEnv(key: EnvKey): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`${key} is not set in environment variables`);
  }

  return value.trim();
}

export function getOptionalEnv(key: EnvKey, fallback = ""): string {
  return process.env[key]?.trim() || fallback;
}

import { z } from "zod";

/**
 * All configuration comes from the environment (apps/api/.env locally,
 * Render dashboard in production). Nothing secret is ever hard-coded.
 * See .env.example for the full list.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  SITE_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional(), // wired in the database step
  ADMIN_OTP_HASH: z.string().optional(), // argon2 hash — auth step
  SESSION_SECRET: z.string().min(16).optional(), // auth step
  SESSION_TTL_MINUTES: z.coerce.number().int().positive().default(60),
  SUPABASE_URL: z.string().optional(),           // image storage (admin uploads)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(), // server-only storage key
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    // Fail fast at boot with a readable message instead of crashing later.
    console.error("Invalid environment:", z.flattenError(parsed.error).fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.data;
}

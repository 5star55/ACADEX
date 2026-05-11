import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { Pool } from "pg";

function env(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function toOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

const baseURL = env("BETTER_AUTH_URL") || "http://localhost:3000";
const dashboardApiKey = env("BETTER_AUTH_API_KEY");
const postgresUrl = env("POSTGRES_URL") || env("POSTGRES_PRISMA_URL");
const trustedOrigins = [
  "http://localhost:3000",
  toOrigin(baseURL),
  env("VERCEL_URL") ? `https://${env("VERCEL_URL")}` : undefined,
  "https://*.vercel.app",
].filter((value): value is string => Boolean(value));

if (!postgresUrl) {
  throw new Error("POSTGRES_URL is required for Better Auth.");
}

declare global {
  // Reuse the pool across hot reloads and serverless invocations where possible.
  var __acadexPostgresPool: Pool | undefined;
}

const database =
  globalThis.__acadexPostgresPool ??
  new Pool({
    connectionString: postgresUrl,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__acadexPostgresPool = database;
}

export const auth = betterAuth({
  database,
  baseURL,
  trustedOrigins,
  emailAndPassword: { enabled: true },
  plugins: dashboardApiKey
    ? [
        dash(),
      ]
    : [],
});

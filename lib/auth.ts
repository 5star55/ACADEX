import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { createPool } from "mysql2/promise";

function env(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

const baseURL = env("BETTER_AUTH_URL") || "http://localhost:3000";
const dashboardApiKey = env("BETTER_AUTH_API_KEY");
const mysqlUrl = env("MYSQL_URL");

if (!mysqlUrl) {
  throw new Error("MYSQL_URL is required for Better Auth.");
}

const database = createPool(mysqlUrl);

export const auth = betterAuth({
  database,
  baseURL,
  emailAndPassword: { enabled: true },
  plugins: dashboardApiKey
    ? [
        dash(),
      ]
    : [],
});

import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { createPool } from "mysql2/promise";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const dashboardApiKey = process.env.BETTER_AUTH_API_KEY;
const dashboardApiUrl = process.env.BETTER_AUTH_API_URL;
const dashboardKvUrl = process.env.BETTER_AUTH_KV_URL;
const mysqlUrl = process.env.MYSQL_URL;

if (!mysqlUrl) {
  throw new Error("MYSQL_URL is required for Better Auth.");
}

const dialect = createPool(mysqlUrl);

export const auth = betterAuth({
  database: { dialect, type: "mysql" },
  baseURL,
  emailAndPassword: { enabled: true },
  plugins: dashboardApiKey
    ? [
        dash({
          apiKey: dashboardApiKey,
          apiUrl: dashboardApiUrl,
          kvUrl: dashboardKvUrl,
        }),
      ]
    : [],
});

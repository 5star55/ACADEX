import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import Database from "better-sqlite3";

const dashboardApiKey = process.env.BETTER_AUTH_API_KEY;
const dashboardApiUrl = process.env.BETTER_AUTH_API_URL;
const dashboardKvUrl = process.env.BETTER_AUTH_KV_URL;

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
  },
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

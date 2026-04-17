import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

const dialect = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "database",
  timezone: "Z",
});

export const auth = betterAuth({
  database: { dialect, type: "mysql" },
  baseURL: "http://localhost:3000/",
  emailAndPassword: { enabled: true },
});

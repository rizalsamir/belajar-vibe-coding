import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://${process.env.DATABASE_USER || "root"}${process.env.DATABASE_PASSWORD ? `:${process.env.DATABASE_PASSWORD}` : ""}@${process.env.DATABASE_HOST || "127.0.0.1"}:${process.env.DATABASE_PORT || 3306}/${process.env.DATABASE_NAME || "belajar_vibe_coding"}`,
  },
});

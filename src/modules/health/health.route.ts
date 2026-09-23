import { Elysia } from "elysia";
import { checkDbConnection } from "../../db";

export const healthRoute = new Elysia({ prefix: "/health" })
  .get("/", async () => {
    const dbStatus = await checkDbConnection();

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
    };
  });

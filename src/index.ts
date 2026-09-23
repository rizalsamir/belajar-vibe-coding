import { Elysia } from "elysia";
import { env } from "./config/env";
import { healthRoute } from "./modules/health/health.route";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .get("/", () => ({
    name: "belajar-vibe-coding API",
    version: "1.0.0",
    healthCheck: "/health",
  }))
  .use(healthRoute)
  .use(usersRoute)
  .listen(env.PORT);

console.log(`🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;

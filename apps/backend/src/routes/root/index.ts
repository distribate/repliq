import { requireAuth } from "#middlewares/require-auth.ts";
import { getHealthRoute } from "#routes/public/get-health.ts";
import { connectServiceRoute, connectServiceSSE } from "#routes/user/connect-service.ts";
import { Hono } from "hono";

const connectService = new Hono()
  .basePath("/connect-service")
  .use(requireAuth("prevent"))
  .route("/", connectServiceRoute)
  .route("/", connectServiceSSE)

export const root = new Hono()
  .basePath("/")
  .route("/", getHealthRoute)
  .route("/", connectService)
import { requireAuth } from "#middlewares/require-auth.ts";
import { getHealthRoute } from "#routes/root/get-health.ts";
import { connectServiceRoute, connectServiceSSE } from "#routes/user/connect-service.ts";
import { Hono } from "hono";
import { notifyRoute } from "./notify";

const config = new Hono()
  .route("/", getHealthRoute)
  .route("/", notifyRoute)

const connectService = new Hono()
  .basePath("/connect-service")
  .use(requireAuth("prevent"))
  .route("/", connectServiceRoute)
  .route("/", connectServiceSSE)

export const root = new Hono()
  .basePath("/")
  .route("/", config)
  .route("/", connectService)
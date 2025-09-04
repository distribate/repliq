import { validateRequest } from "#middlewares/validate-request.ts";
import { getHealthRoute } from "#routes/public/get-health.ts";
import { connectServiceRoute, connectServiceSSE } from "#routes/user/connect-service.ts";
import { Hono } from "hono";

const connectService = new Hono()
  .basePath("/connect-service")
  .use(validateRequest("prevent"))
  .route("/", connectServiceRoute)
  .route("/", connectServiceSSE)

export const root = new Hono()
  .basePath("/")
  .route("/", getHealthRoute)
  .route("/", connectService)
import { validateRequest } from "#middlewares/validate-request.ts";
import { notificationsSSERoute } from "#routes/notifications/notifications-sse.ts";
import { Hono } from "hono";

const notifications = new Hono()
  .basePath("/notifications")
  // #http-only cookies accepted for only production mode
  .use(validateRequest("prevent"))
  .route("/", notificationsSSERoute)

export const sse = new Hono()
  .route("/", notifications)
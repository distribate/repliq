import { Hono } from "hono";
import { checkNotificationRoute } from "./check-notification";
import { getUserNotificationsRoute } from "./get-user-notifications";
import { notificationsSSERoute } from "./notifications-sse";
import { validateRequest } from "#middlewares/validate-request.ts";

export const notifications = new Hono()
  .basePath("/notification")
  // #http-only cookies accepted for only production mode
  .use(validateRequest("prevent"))
  .route("/", checkNotificationRoute)
  .route("/", getUserNotificationsRoute)
  .route("/", notificationsSSERoute)
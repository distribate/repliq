import { Hono } from "hono";
import { checkNotificationRoute } from "./check-notification";
import { getUserNotificationsRoute } from "./get-user-notifications";
import { notificationsSSERoute } from "./notifications-sse";
import { requireAuth } from "#middlewares/require-auth.ts";

export const notifications = new Hono()
  .basePath("/notification")
  // #http-only cookies accepted for only production mode
  .use(requireAuth("prevent"))
  .route("/", checkNotificationRoute)
  .route("/", getUserNotificationsRoute)
  .route("/", notificationsSSERoute)
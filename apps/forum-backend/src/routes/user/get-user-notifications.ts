import { throwError } from "#helpers/throw-error.ts";
import { getUserNotifications } from "#lib/queries/user/get-user-notifications.ts";
import { Hono } from "hono";

export const getUserNotificationsRoute = new Hono()
  .get("/get-user-notifications/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const notifications = await getUserNotifications(nickname);
      return ctx.json(notifications, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
);
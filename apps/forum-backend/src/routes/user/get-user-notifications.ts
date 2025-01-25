import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserNotifications } from "#lib/queries/user/get-user-notifications.ts";
import { Hono } from "hono";
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const getUserNotificationsRoute = new Hono()
  .get("/get-user-notifications", async (ctx) => {
    const nickname = getNickname()

    try {
      const notifications = await getUserNotifications(nickname);

      return ctx.json({ data: notifications }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  );
import { throwError } from '#utils/throw-error.ts';
import { getUserNotifications } from "#lib/queries/user/get-user-notifications.ts";
import { Hono } from "hono";
import { getNickname } from '#utils/get-nickname-from-storage.ts';
import * as z from "zod";
import { zValidator } from '@hono/zod-validator';

export const getUserNotificationsSchema = z.object({
  type: z.enum(['system', 'news', 'requests']),
  cursor: z.string().optional(),
})

export const getUserNotificationsRoute = new Hono()
  .get("/get-user-notifications", zValidator("query", getUserNotificationsSchema), async (ctx) => {
    const result = getUserNotificationsSchema.parse(ctx.req.query());
    const nickname = getNickname()

    try {
      const notifications = await getUserNotifications({ nickname, ...result });

      return ctx.json(notifications, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
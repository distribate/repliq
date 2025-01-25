import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { updateNotification } from "#lib/queries/notifications/update-notification.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { checkNotificationSchema } from "@repo/types/schemas/notification/check-notification-schema";

export const checkNotificationRoute = new Hono()
  .post("/check-notification", zValidator("json", checkNotificationSchema), async (ctx) => {
    const nickname = getNickname()
    const body = await ctx.req.json();
    const result = checkNotificationSchema.parse(body);

    try {
      const res = await updateNotification({
        nickname, notificationId: result.notification_id
      });
      
      if (!res.numUpdatedRows) {
        return ctx.json({ error: "Error checking notification" }, 404);
      }

      return ctx.json({ status: "Notification checked" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
);
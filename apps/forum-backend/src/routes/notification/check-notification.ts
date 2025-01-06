import { throwError } from "#helpers/throw-error.ts";
import { updateNotification } from "#lib/queries/notifications/update-notification.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const notificationIdSchema = z.object({
  notification_id: z.string(),
});

export const checkNotificationRoute = new Hono()
  .post("/check-notification", zValidator("json", notificationIdSchema), async (ctx) => {
    const nickname = getNickname()
    const body = await ctx.req.json();
    const result = notificationIdSchema.parse(body);

    try {
      await updateNotification({
        nickname, notificationId: result.notification_id
      });
      
      return ctx.json({ status: "Notification checked" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
);
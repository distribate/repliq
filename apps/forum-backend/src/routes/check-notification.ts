import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

async function checkNotification(notificationId: string, nickname: string) {
  return await forumDB
    .updateTable("notifications")
    .set({ read: true })
    .where("id", "=", notificationId)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow();
}

const notificationIdSchema = z.object({
  notification_id: z.string(),
});

export const checkNotificationRoute = new Hono()
  .post("/check-notification/:nickname", zValidator("json", notificationIdSchema), async (ctx) => {
    const { nickname } = ctx.req.param();
    const body = await ctx.req.json();
    const result = notificationIdSchema.parse(body);

    try {
      await checkNotification(result.notification_id, nickname);
      return ctx.json({ status: "Notification checked" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
);
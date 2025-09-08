import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { checkNotificationSchema } from "@repo/types/schemas/notification/check-notification-schema";
import { forumDB } from "#shared/database/forum-db.ts";

type UpdateNotification = {
  nickname: string
  notificationId: string
}

export async function updateNotification({
  nickname, notificationId
}: UpdateNotification) {
  return forumDB
    .updateTable("notifications")
    .set({ read: true })
    .where("id", "=", notificationId)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow();
}

export const checkNotificationRoute = new Hono()
  .post("/check", zValidator("json", checkNotificationSchema), async (ctx) => {
    const nickname = getNickname()
    const { notification_id: notificationId } = checkNotificationSchema.parse(await ctx.req.json());

    try {
      const res = await updateNotification({ nickname, notificationId });

      if (!res.numUpdatedRows) {
        return ctx.json({ error: "Error checking notification" }, 404);
      }

      return ctx.json({ status: "Notification checked" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
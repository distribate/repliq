import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#lib/modules/context.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { checkNotificationSchema } from "@repo/types/schemas/notification/check-notification-schema";
import { forumDB } from "#shared/database/forum-db.ts";
import * as z from 'zod';

type UpdateNotification = {
  nickname: string
} & z.infer<typeof checkNotificationSchema>
 
export async function updateNotification({
  nickname, notification_id
}: UpdateNotification) {
  return forumDB
    .updateTable("notifications")
    .set({ read: true })
    .where("id", "=", notification_id)
    .where("nickname", "=", nickname)
    .returning("id")
    .executeTakeFirstOrThrow();
}

export const checkNotificationRoute = new Hono()
  .post("/check", zValidator("json", checkNotificationSchema), async (ctx) => {
    const nickname = getNickname()
    const result = checkNotificationSchema.parse(await ctx.req.json());

    try {
      const res = await updateNotification({ nickname, ...result });

      const data = {
        notification_id: res.id
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { Hono } from "hono";

async function getNotifications(nickname: string) {
  return await forumDB
    .selectFrom('notifications')
    .select((eb) => [
      "id",
      "message",
      "nickname",
      "read",
      "type",
      eb.cast<string>('created_at', 'text').as('created_at')
    ])
    .where("nickname", "=", nickname)
    .execute();
}

export const getUserNotificationsRoute = new Hono()
  .get("/get-user-notifications/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const notifications = await getNotifications(nickname);
      return ctx.json(notifications, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
);
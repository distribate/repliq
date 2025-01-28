import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function isAdmin(nickname: string): Promise<boolean> {
  const exists = await forumDB
    .selectFrom("users")
    .innerJoin("admins", "admins.user_id", "users.id")
    .select("users.nickname")
    .where("users.nickname", "=", nickname)
    .executeTakeFirst();

  return !!exists;
}

async function hasNewNotifications(nickname: string) {
  const exists = await forumDB
    .selectFrom("notifications")
    .select("nickname")
    .where("nickname", "=", nickname)
    .where("read", "=", false)
    .executeTakeFirst();

  return !!exists;
}

async function hasNewFriends(nickname: string) {
  const exists = await forumDB
    .selectFrom("friends_requests")
    .select("id")
    .where("recipient", "=", nickname)
    .executeTakeFirst();

  return !!exists
}

export const getUserGlobalOptionsRoute = new Hono()
  .get("/get-user-global-options", async (ctx) => {
    const nickname = getNickname();

    try {
      const [is_admin, has_new_notifications, has_new_friends] = await Promise.all([
        isAdmin(nickname),
        hasNewNotifications(nickname),
        hasNewFriends(nickname)
      ]);

      return ctx.json({
        data: {
          is_admin,
          can_create_threads: true,
          can_create_comments: true,
          can_create_posts: true,
          has_new_notifications,
          has_new_friends,
          has_new_events: false
        }
      }, 200)
    } catch (e) {
      console.log(e)
      return ctx.json({ error: throwError(e) }, 500);
    }
  })
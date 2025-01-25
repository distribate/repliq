import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function isAdmin(nickname: string): Promise<boolean> {
  const query = await forumDB
    .selectFrom("users")
    .innerJoin("admins", "admins.user_id", "users.id")
    .select(forumDB.fn.count("admins.user_id").as("count"))
    .$castTo<{ count: number }>()
    .where("users.nickname", "=", nickname)
    .executeTakeFirst();

  return query ? query.count > 0 : false;
}

async function hasNewNotifications(nickname: string) {
  const query = await forumDB
    .selectFrom("notifications")
    .select(forumDB.fn.countAll().as("count"))
    .where("nickname", "=", nickname)
    .where("read", "=", false)
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  return query ? query.count > 0 : false
}

async function hasNewFriends(nickname: string) {
  const query = await forumDB
    .selectFrom("friends_requests")
    .select(forumDB.fn.countAll().as("count"))
    .where("recipient", "=", nickname)
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  return query ? query.count > 0 : false
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
      return ctx.json({ error: throwError(e) }, 500);
    }
  })
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

async function hasCreatePosts(nickname: string) {
  const [countByDay, isPunish] = await Promise.all([
    forumDB
      .selectFrom("posts_users")
      .select("post_id")
      .where("nickname", "=", nickname)
      .where("posts_users.created_at", ">", new Date(Date.now() - 24 * 60 * 60 * 1000))
      .execute(),
    forumDB
      .selectFrom("users_punish")
      .select("id")
      .where("nickname", "=", nickname)
      .where("type", "=", "posts")
      .execute()
  ])

  if (isPunish.length >= 1) return false;

  if (countByDay.length >= 10) return false;

  return true
}

async function hasCreateComments(nickname: string) {
  const [countByDay, isPunish] = await Promise.all([
    forumDB
      .selectFrom("comments")
      .select("comments.id")
      .where("user_nickname", "=", nickname)
      .where("comments.created_at", ">", new Date(Date.now() - 24 * 60 * 60 * 1000))
      .execute(),
    forumDB
      .selectFrom("users_punish")
      .select("id")
      .where("nickname", "=", nickname)
      .where("type", "=", "comments")
      .execute()
  ])

  if (isPunish.length >= 1) return false;

  if (countByDay.length >= 40) return false;

  return true
}

async function hasCreateThreads(nickname: string) {
  const [countByDay, isPunish] = await Promise.all([
    forumDB
      .selectFrom("threads_users")
      .select("thread_id")
      .where("threads_users.user_nickname", "=", nickname)
      .where("threads_users.created_at", ">", new Date(Date.now() - 24 * 60 * 60 * 1000))
      .execute(),
    forumDB
      .selectFrom("users_punish")
      .select("id")
      .where("nickname", "=", nickname)
      .where("type", "=", "threads")
      .execute()
  ])

  if (isPunish.length >= 1) return false;

  if (countByDay.length >= 10) return false;

  return true
}

export const getUserGlobalOptionsRoute = new Hono()
  .get("/get-user-global-options", async (ctx) => {
    const nickname = getNickname();

    try {
      const [
        is_admin,
        has_new_notifications,
        has_new_friends,
        can_create_posts,
        can_create_comments,
        can_create_threads
      ] = await Promise.all([
        isAdmin(nickname),
        hasNewNotifications(nickname),
        hasNewFriends(nickname),
        hasCreatePosts(nickname),
        hasCreateComments(nickname),
        hasCreateThreads(nickname)
      ]);

      return ctx.json({
        data: {
          is_admin,
          can_create_threads,
          can_create_comments,
          can_create_posts,
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
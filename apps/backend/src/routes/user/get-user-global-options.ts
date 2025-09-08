import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { validateAdmin } from "#lib/validators/validate-admin.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sql } from "kysely";

const MAX_POSTS_BY_DAY = 10
const MAX_COMMENTS_BY_DAY = 40;
const MAX_THREADS_BY_DAY = 10;

async function getUserStatusAndPermissions(nickname: string) {
  const result = await forumDB
    .selectFrom('users')
    .where('users.nickname', '=', nickname)
    .select([
      // #has new unread notifications?
      sql<boolean>`(
      SELECT count(*) FROM notifications 
      WHERE notifications.nickname = ${nickname} AND notifications.read = false
    ) > 0`.as('has_new_notifications'),
      // #has new incoming friends requests?
      sql<boolean>`(
      SELECT count(*) FROM friends_requests 
      WHERE friends_requests.recipient = ${nickname}
    ) > 0`.as('has_new_friends'),
      // #can create a issue (ticket)? (1 ticket in day)
      sql<boolean>`(
      SELECT count(*) FROM issues 
      WHERE issues.nickname = ${nickname} AND issues.created_at > NOW() - INTERVAL '1 day'
    ) = 0`.as('can_create_issue'),
      // #can create a posts?
      sql<boolean>`(
      (SELECT count(*) FROM users_punish WHERE users_punish.nickname = ${nickname} AND users_punish.type = 'posts') = 0
      AND
      (SELECT count(*) FROM posts_users WHERE posts_users.nickname = ${nickname} AND posts_users.created_at > NOW() - INTERVAL '1 day') < ${MAX_POSTS_BY_DAY}
    )`.as('can_create_posts'),
      // #can create comments?
      sql<boolean>`(
      (SELECT count(*) FROM users_punish WHERE users_punish.nickname = ${nickname} AND users_punish.type = 'comments') = 0
      AND
      (SELECT count(*) FROM comments WHERE comments.nickname = ${nickname} AND comments.created_at > NOW() - INTERVAL '1 day') < ${MAX_COMMENTS_BY_DAY}
    )`.as('can_create_comments'),
      // #can create threads?
      sql<boolean>`(
      (SELECT count(*) FROM users_punish WHERE users_punish.nickname = ${nickname} AND users_punish.type = 'threads') = 0
      AND
      (SELECT count(*) FROM threads_users WHERE threads_users.nickname = ${nickname} AND threads_users.created_at > NOW() - INTERVAL '1 day') < ${MAX_THREADS_BY_DAY}
    )`.as('can_create_threads'),
    ])
    .executeTakeFirst(); 

  return result;
}

export const getUserGlobalOptionsRoute = new Hono()
  .get("/user-global-options", async (ctx) => {
    const nickname = getNickname();

    try {
      const [perms, isAdmin] = await Promise.all([
        getUserStatusAndPermissions(nickname),
        validateAdmin(nickname)
      ]);

      if (!perms) {
        return ctx.json({ error: "User not found" }, 404);
      }

      const data = {
        is_admin: isAdmin, 
        has_new_notifications: Boolean(perms.has_new_notifications),
        has_new_friends: Boolean(perms.has_new_friends),
        can_create_issue: Boolean(perms.can_create_issue),
        can_create_posts: Boolean(perms.can_create_posts),
        can_create_comments: Boolean(perms.can_create_comments),
        can_create_threads: Boolean(perms.can_create_threads),
      };

      ctx.res.headers.set("Cache-Control", "public, max-age=5")

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })
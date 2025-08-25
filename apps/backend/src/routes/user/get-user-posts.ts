import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#utils/throw-error.ts';
import { getUserPosts } from '#lib/queries/user/get-user-posts.ts';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';
import { userPreferenceAndPrivateValidation } from '#utils/validate-user-preference-private.ts';
import { forumDB } from '#shared/database/forum-db.ts';

async function createPostsView(
  v: { nickname: string, post_id: string }[]
) {
  return forumDB
    .insertInto("posts_views")
    .values(v)
    .onConflict((oc) => oc.columns(["nickname", "post_id"]).doNothing())
    .execute()
}

export const getUserPostsRoute = new Hono()
  .get('/get-user-posts/:nickname', zValidator('query', getUserPostsSchema), async (ctx) => {
    const requestedUserNickname = ctx.req.param("nickname");
    const { filteringType, ascending, cursor, searchQuery } = getUserPostsSchema.parse(ctx.req.query());
    const initiator = getNickname()

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient: requestedUserNickname
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const posts = await getUserPosts({
        filteringType, ascending, cursor, currentUserNickname: initiator, requestedUserNickname, searchQuery
      });

      if (posts && posts.data.length >= 1) {
        createPostsView(posts.data.map(v => ({ nickname: initiator, post_id: v.id })))
      }

      return ctx.json(posts, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
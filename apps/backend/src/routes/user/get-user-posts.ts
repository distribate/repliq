import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#utils/throw-error.ts';
import { getUserPosts } from '#lib/queries/user/get-user-posts.ts';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import { getNickname } from '#lib/modules/context.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { userPreferenceAndPrivateValidation } from '#lib/validators/validate-user-preference-private.ts';

async function createPostsView(
  values: { nickname: string, post_id: string }[]
) {
  return forumDB
    .insertInto("posts_views")
    .values(values)
    .onConflict((oc) => oc
      .columns(["nickname", "post_id"]).doNothing()
    )
    .execute()
}

export const getUserPostsRoute = new Hono()
  .get('/user-posts/:nickname', zValidator('query', getUserPostsSchema), async (ctx) => {
    const recipient = ctx.req.param("nickname");
    const initiator = getNickname()
    const result = getUserPostsSchema.parse(ctx.req.query());

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const data = await getUserPosts(recipient, { ...result, currentUserNickname: initiator });

      const posts = data.data

      if (posts && posts.length >= 1) {
        const viewedPosts = posts.map(post => ({ nickname: initiator, post_id: post.id }));

        createPostsView(viewedPosts)
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
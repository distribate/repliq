import { Hono, type Env } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserPosts } from '#lib/queries/user/get-user-posts.ts';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const getUserPostsRoute = new Hono()
  .get('/get-user-posts/:nickname', zValidator('query', getUserPostsSchema), async (ctx) => {
    const { nickname: requestedUserNickname } = ctx.req.param();
    const { filteringType, ascending } = getUserPostsSchema.parse(ctx.req.query());

    const nickname = getNickname()

    try {
      const posts = await getUserPosts({
        filteringType, ascending, currentUserNickname: nickname, requestedUserNickname
      });

      return ctx.json(posts, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
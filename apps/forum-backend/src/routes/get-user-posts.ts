import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#helpers/throw-error.ts';
import { getUserPosts } from '#lib/queries/get-user-posts.ts';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';

export const getUserPostsRoute = new Hono()
.get('/get-user-posts/:nickname', zValidator('query', getUserPostsSchema), async(ctx) => {
  const { nickname: requestedUserNickname } = ctx.req.param();
  const query = getUserPostsSchema.parse(ctx.req.query());
  
  let posts;
  
  try {
    posts = await getUserPosts({ ...query, requestedUserNickname });
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 400);
  }
  
  return ctx.json(posts, 200);
});
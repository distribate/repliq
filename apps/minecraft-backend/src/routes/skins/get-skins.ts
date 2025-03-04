import { Hono } from 'hono';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';

export const getSkinRoute = new Hono()
  .get('/get-skin/:nickname', async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const skin = await getPlayerSkin(nickname)

      ctx.header('Content-Type', 'image/png')
      ctx.header('Cache-Control', 'public, max-age=30')
      
      return ctx.body(skin as unknown as ReadableStream, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
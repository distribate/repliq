import { Hono } from 'hono';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';
import { extractHeadFromSkin } from '#utils/extract-head-from-skin.ts';

export const getHeadRoute = new Hono()
  .get("/get-head/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const skin = await getPlayerSkin({ nickname })
      const buffer = await skin.arrayBuffer();
      const head = await extractHeadFromSkin(buffer)

      ctx.header('Content-Type', 'image/png')
      ctx.header('Cache-Control', 'public, max-age=120')

      return ctx.body(head as unknown as ReadableStream, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
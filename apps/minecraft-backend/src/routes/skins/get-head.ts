import { Hono } from 'hono';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';
import { extractHeadFromSkin } from '#utils/extract-head-from-skin.ts';

export const getHeadRoute = new Hono()
  .get("/get-head/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const skin = await getPlayerSkin(nickname)

      const start = performance.now();

      const buffer = await skin.arrayBuffer();
      const head = await extractHeadFromSkin(buffer)

      const end = performance.now();

      console.log(`Request time: ${end - start}ms`)

      ctx.header('Content-Type', 'image/png')
      ctx.header('Cache-Control', 'public, max-age=30')

      return ctx.body(head as unknown as ReadableStream, 200)
    } catch (e) {
      console.error(e)
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
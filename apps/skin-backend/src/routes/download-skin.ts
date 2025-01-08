import { Hono } from 'hono';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const downloadSkinRoute = new Hono()
  .get('/download-skin/:nickname', async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const skin = await getPlayerSkin({ nickname })
      const buffer = await skin.arrayBuffer();

      ctx.header('Content-Type', 'image/png')
      ctx.header('Content-Disposition', `attachment; filename=${nickname}-skin.png`)

      return ctx.body(buffer as unknown as ReadableStream, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
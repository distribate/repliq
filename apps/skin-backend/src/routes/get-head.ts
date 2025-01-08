import { Hono } from 'hono';
import sharp from 'sharp';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';

export const getHeadRoute = new Hono()
  .get("/get-head/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const skin = await getPlayerSkin({ nickname })
      const buffer = await skin.arrayBuffer();

      const head = await sharp(buffer)
        .extract({ left: 8, top: 8, width: 8, height: 8 })
        .resize(128, 128, { kernel: 'nearest' })
        .toBuffer();

      ctx.header('Content-Type', 'image/png')

      return ctx.body(head as unknown as ReadableStream, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });
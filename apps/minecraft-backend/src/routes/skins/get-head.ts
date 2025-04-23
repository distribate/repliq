import { Hono } from 'hono';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';
import { extractHeadFromSkin } from '#utils/extract-head-from-skin.ts';
// @ts-ignore
import SteveHead from "@repo/assets/images/minecraft/steve_head.jpg"
import fs from 'fs';
import path from 'path';

export const getHeadRoute = new Hono()
  .get("/get-head/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    ctx.header('Content-Type', 'image/png')
    ctx.header('Cache-Control', 'public, max-age=30')

    try {
      const skin = await getPlayerSkin(nickname)
      const buffer = await skin.arrayBuffer();
      const head = await extractHeadFromSkin(buffer)

      return ctx.body(head as unknown as ReadableStream, 200)
    } catch (e) {
      // @ts-ignore
      const stream = fs.createReadStream(path.resolve(SteveHead));

      return ctx.body(stream as unknown as ReadableStream, 200);
    }
  });
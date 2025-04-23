import { Hono } from 'hono';
import { getPlayerSkin } from '#lib/queries/get-player-skin.ts';
// @ts-ignore
import SteveSkin from "@repo/assets/images/minecraft/steve_skin.png"
import fs from 'fs';
import path from 'path';

export const getSkinRoute = new Hono()
  .get('/get-skin/:nickname', async (ctx) => {
    const { nickname } = ctx.req.param();

    ctx.header('Content-Type', 'image/png')
    ctx.header('Cache-Control', 'public, max-age=30')

    try {
      const skin = await getPlayerSkin(nickname)
      
      return ctx.body(skin as unknown as ReadableStream, 200)
    } catch (e) {
      // @ts-ignore
      const stream = fs.createReadStream(path.resolve(SteveSkin));
  
      return ctx.body(stream as unknown as ReadableStream, 200);
    }
  });
import ky from 'ky';
import { SKIN_HEAD_ELY_URL } from '#shared/constants/external-skin-api-urls.ts';
import { Hono } from 'hono';
import fs from 'fs/promises';
import path from 'path';

export const getHeadRoute = new Hono()
  .get("/get-head/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    const url = `${SKIN_HEAD_ELY_URL}/${nickname.toLowerCase()}.png&scale=18.9&renderFace=1`;

    try {
      const response = await ky.get(url);

      if (response.status === 404) {
        throw new Error("Image not found")
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      return ctx.body(buffer as unknown as ReadableStream, 200, {
        "Content-Type": "image/png",
      })
    } catch (e) {
      try {
        const steveHeadPath = path.resolve(
          __dirname, '../../../../packages/assets/images/minecraft/steve_head.jpg'
        );

        const buffer = await fs.readFile(steveHeadPath);

        return ctx.body(buffer as unknown as ReadableStream, 200, {
          "Content-Type": "image/jpeg",
        });
      } catch (fsError) {
        return ctx.body("Internal Server Error", 500, {
          "Content-Type": "text/plain",
        });
      }
    }
  })
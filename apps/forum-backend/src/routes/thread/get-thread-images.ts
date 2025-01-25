import { getThreadImages } from '#lib/queries/thread/get-thread-images.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";

export const getThreadImagesRoute = new Hono()
  .get("/get-thread-images/:id", async (ctx) => {
    const { id } = ctx.req.param();

    try {
      const images = await getThreadImages(id)

      return ctx.json({ data: images }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })
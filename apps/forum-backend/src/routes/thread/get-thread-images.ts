import { getPublicUrl } from '#routes/public/get-news.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";

async function getThreadImages(id: string) {
  const images = await forumDB
    .selectFrom("threads_images")
    .select("image_url")
    .where("thread_id", "=", id)
    .execute()

  if (!images || !images.length) {
    return []
  }

  const publicUrls = await Promise.all(
    images.map(image =>
      getPublicUrl("threads", image.image_url)
        .then(r => r.data.publicUrl)
    )
  );

  return publicUrls.filter(Boolean);
}

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
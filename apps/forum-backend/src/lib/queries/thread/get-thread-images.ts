import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";

export async function getThreadImages(id: string) {
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
    )
  );

  return publicUrls.filter(Boolean);
}
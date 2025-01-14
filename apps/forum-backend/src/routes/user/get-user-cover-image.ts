import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getCoverImageUrl(url: string) {
  const { data } = supabase
    .storage
    .from("user_images")
    .getPublicUrl(url);

  return data.publicUrl;
}

async function getUserCoverImage(nickname: string) {
  return await forumDB
    .selectFrom("users")
    .select("cover_image")
    .where("nickname", "=", nickname)
    .executeTakeFirst();
}

export const getUserCoverImageRoute = new Hono()
  .get("/get-user-cover-image/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const userCoverImage = await getUserCoverImage(nickname);

      if (!userCoverImage || !userCoverImage?.cover_image) {
        return ctx.json({ image_url: null }, 200);
      }

      const { cover_image } = userCoverImage;

      const imageUrl = await getCoverImageUrl(cover_image);

      return ctx.json({ image_url: imageUrl }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })
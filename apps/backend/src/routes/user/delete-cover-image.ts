import { forumDB } from "#shared/database/forum-db.ts"
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#lib/modules/context.ts"
import { throwError } from "#utils/throw-error.ts"
import { logger } from "@repo/shared/utils/logger.ts";
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono"
import { getUserImageType } from "./create-cover-image";

async function deleteCoverImage(nickname: string) {
  const exists = await forumDB
    .selectFrom("users")
    .select("cover_image")
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (!exists || !exists.cover_image) {
    throw new Error("Error deleting cover image. Image not found")
  }

  const url = exists.cover_image;
  const type = getUserImageType(url)

  return forumDB.transaction().execute(async (trx) => {
    const updateCover = async () => {
      const query = await trx
        .updateTable("users")
        .set({ cover_image: null })
        .where("nickname", "=", nickname)
        .executeTakeFirstOrThrow();

      if (!query.numUpdatedRows) {
        throw new Error("Not changed");
      }
      
      return true;
    };

    if (type === "default") {
      return updateCover();
    }

    if (type === 'custom') {
      const prefix = '/public/user_images/';
      const index = url.indexOf(prefix);
      const target = url.slice(index + prefix.length);

      const result = await supabase
        .storage
        .from(USER_IMAGES_BUCKET)
        .remove([target])

      if (result.error) {
        logger.error(result.error);
        throw new Error(result.error.message)
      }

      await updateCover();
      return true;
    }

    throw new Error(`Unknown image type: ${type}`);
  })
}

export const deleteCoverImageRoute = new Hono()
  .delete("/remove", async (ctx) => {
    const nickname = getNickname()

    try {
      const data = await deleteCoverImage(nickname)

      return ctx.json({ data, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })
import { forumDB } from "#shared/database/forum-db.ts"
import { supabase } from "#shared/supabase/supabase-client.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"

async function deleteCoverImage(nickname: string) {
  return await forumDB.transaction().execute(async (trx) => {
    const ci = await trx
      .selectFrom("users")
      .select("cover_image")
      .where("nickname", "=", nickname)
      .executeTakeFirst()

    if (!ci || !ci.cover_image) {
      return;
    }

    if (ci.cover_image.startsWith("cover")) {
      await supabase.storage.from("user_images").remove([ci.cover_image])
    }

    const q = await trx
      .updateTable("users")
      .set({ cover_image: null })
      .where("nickname", "=", nickname)
      .executeTakeFirst()

    if (!q.numUpdatedRows) {
      return;
    }

    return null
  })
}

export const deleteCoverImageRoute = new Hono()
  .delete("/delete-cover-image", async (ctx) => {
    const nickname = getNickname()

    try {
      const res = await deleteCoverImage(nickname)

      if (res === undefined) {
        return ctx.json({ error: "Error deleting cover image" }, 404)
      }

      return ctx.json({ data: res, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })
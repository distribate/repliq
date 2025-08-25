import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "#utils/throw-error.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts"

const getAvailableCategories = async () => {
  return forumDB
    .selectFrom("category")
    .select(eb => [
      "title",
      "available",
      "description",
      "emoji",
      "color",
      eb.cast<number>('id', 'int8').as('id')
    ])
    .orderBy("id", "asc")
    .execute();
}

export const getAvailableCategoriesRoute = new Hono()
.get("/get-available-categories", async (ctx) => {

  try {
    let categories = await getAvailableCategories()

    categories = categories.map(category => ({
      ...category,
      emoji: getPublicUrl(STATIC_IMAGES_BUCKET, category.emoji)
    }))

    ctx.header("Cache-Control", "public, max-age=300")

    return ctx.json({ data: categories }, 200)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
})
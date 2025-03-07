import { getAvailableCategories } from "#lib/queries/categories/get-available-categories.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono";

export const getAvailableCategoriesRoute = new Hono()
.get("/get-available-categories", async (ctx) => {

  try {
    let categories = await getAvailableCategories()

    categories = categories.map(category => ({
      ...category,
      emoji: getPublicUrl(STATIC_IMAGES_BUCKET, category.emoji)
    }))

    return ctx.json({ data: categories }, 200)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
})
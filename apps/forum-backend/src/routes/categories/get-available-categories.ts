import { getAvailableCategories } from "#lib/queries/categories/get-available-categories.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export const getAvailableCategoriesRoute = new Hono()
.get("/get-available-categories", async (ctx) => {

  try {
    const categories = await getAvailableCategories()

    return ctx.json({ data: categories }, 200)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
})
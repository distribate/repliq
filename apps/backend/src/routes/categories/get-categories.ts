import { throwError } from '#utils/throw-error.ts';
import { Hono } from "hono";
import { getCategories } from '#lib/queries/categories/get-categories.ts';

export const getCategoriesRoute = new Hono()
  .get("/get-categories", async (ctx) => {
    try {
      const categories = await getCategories();

      return ctx.json({ data: categories }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })
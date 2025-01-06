import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { Hono } from "hono";

export type CategoryModel = {
  hasThreads: boolean;
  title: string;
  id: number;
  threads_count: number
};

export async function getCategories(): Promise<CategoryModel[]> {
  const categories = await forumDB
    .selectFrom("category")
    .select([
      "id", 
      "title",
      forumDB.fn.count("threads.id").as("threads_count")
    ])
    .groupBy("category.id")
    .execute();

  return categories.map((category) => ({
    id: Number(category.id),
    title: category.title,
    hasThreads: Number(category.threads_count) > 0,
    threads_count: Number(category.threads_count),
  }));
}

export const getCategoriesRoute = new Hono()
.get("/get-categories", async (ctx) => {

  try {
    const categories = await getCategories();
    return ctx.json(categories, 200);
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);  
  }
})
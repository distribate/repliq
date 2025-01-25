import { forumDB } from "#shared/database/forum-db.ts";

export type CategoryModel = {
  has_threads: boolean;
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
    has_threads: Number(category.threads_count) > 0,
    threads_count: Number(category.threads_count),
  }));
}
import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

export type CategoryModel = {
  has_threads: boolean;
  title: string;
  id: number;
  threads_count: number;
  emoji: string;
  color: string;
};

export async function getCategories(): Promise<CategoryModel[]> {
  return await forumDB
    .selectFrom("category")
    .innerJoin("threads", "category.id", "threads.category_id")
    .select(eb => [
      "category.title",
      "category.color",
      "category.emoji",
      forumDB.fn.count<number>("threads.id").as("threads_count"),
      sql<boolean>`COUNT(threads.id) > 1`.as("has_threads"),
      eb.cast<number>('category.id', 'int8').as('id')
    ])
    .groupBy("category.id")
    .execute();
}
import type { getCategoryThreadsSchema } from "#routes/categories/get-category-threads.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { z } from "zod";

type ThreadsFromCategories = z.infer<typeof getCategoryThreadsSchema> & {
  category_id: string
}

export async function getThreadsCategories({
  category_id, ascending, limit, range
}: ThreadsFromCategories) {
  let query = forumDB
    .selectFrom("threads")
    .select(["threads.id", "threads.title", "threads.created_at", "threads.updated_at", "threads.visibility"])  
    .where("threads.category_id", "=", category_id);

  if (limit) query = query.limit(limit);
  if (range) query.offset(range[0]).limit(range[1] - range[0] + 1);

  return await query.execute();
}
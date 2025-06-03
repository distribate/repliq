import { forumCategoriesClient } from "@repo/shared/api/forum-client";

type ThreadsFromCategories = {
  categoryId: string;
  cursor?: string;
  limit?: number;
};

export async function getThreadsCategories({
  categoryId, limit = 3,  cursor
}: ThreadsFromCategories) {
  const res = await forumCategoriesClient.categories["get-category-threads"][":id"].$get({
    query: {
      cursor, limit: limit.toString(),  ascending: "false"
    },
    param: { id: categoryId },
  });

  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data
}
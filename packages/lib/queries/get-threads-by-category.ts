import { forumCategoriesClient } from "@repo/shared/api/forum-client";

type ThreadsFromCategories = {
  categoryId: string;
} & {
  range: number[]
  limit?: number;
};

export async function getThreadsCategories({
  categoryId,
  range,
  limit = 3,
}: ThreadsFromCategories) {
  const res = await forumCategoriesClient.categories["get-category-threads"][":category_id"].$get({
    query: { 
      range: `${range[0]},${range[1]}`, 
      limit: limit.toString(),
      ascending: "false"
    },
    param: { category_id: categoryId },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data
}
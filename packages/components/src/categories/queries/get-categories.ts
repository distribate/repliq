import { forumCategoriesClient } from "@repo/shared/api/forum-client";

export type CategoryModel = {
  hasThreads: boolean;
  title: string;
  id: number;
};

export async function getCategories(): Promise<CategoryModel[] | null> {
  const res = await forumCategoriesClient.categories["get-categories"].$get()

  const data = await res.json();

  if (!data || "error" in data) {
    return null
  }

  return data
}
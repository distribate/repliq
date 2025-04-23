import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumCategoriesClient } from "@repo/shared/api/forum-client.ts";

async function getAvailableCategories() {
  const res = await forumCategoriesClient.categories["get-available-categories"].$get()

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data.data
}

export const AVAILABLE_CATEGORIES_QUERY_KEY = createQueryKey("ui", [
  "available-categories",
]);

export const availableCategoriesQuery = (enabled: boolean) => useQuery({
  queryKey: AVAILABLE_CATEGORIES_QUERY_KEY,
  queryFn: getAvailableCategories,
  refetchOnWindowFocus: false,
  enabled,
});
import { useQuery } from "@tanstack/react-query";
import { getAvailableCategories } from "./get-available-categories.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const AVAILABLE_CATEGORIES_QUERY_KEY = createQueryKey("ui", [
  "available-categories",
]);

export const availableCategoriesQuery = (enabled: boolean) =>
  useQuery({
    queryKey: AVAILABLE_CATEGORIES_QUERY_KEY,
    queryFn: () => getAvailableCategories(),
    refetchOnWindowFocus: false,
    enabled,
  });

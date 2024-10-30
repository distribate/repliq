import { useQuery } from "@tanstack/react-query";
import { getAvailableCategories } from "./get-available-categories.ts";

export const AVAILABLE_CATEGORIES_QUERY_KEY = ["ui", "available-categories"]

export const availableCategoriesQuery = (enabled: boolean) => {
	return useQuery({
		queryKey: AVAILABLE_CATEGORIES_QUERY_KEY,
		queryFn: () => getAvailableCategories(),
		refetchOnWindowFocus: false,
		enabled: enabled
	})
}
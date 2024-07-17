import { useQuery } from "@tanstack/react-query";
import { getAvailableCategories } from "./get-available-categories.ts";

export const availableCategoriesQuery = ({
	enabled = false
}: {
	enabled: boolean
}) => {
	return useQuery({
		queryKey: ["ui", "available-categories"],
		queryFn: () => getAvailableCategories(),
		refetchOnWindowFocus: false,
		enabled: enabled
	})
}
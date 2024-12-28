import { useQuery } from "@tanstack/react-query";
import { getRules } from "@repo/lib/queries/get-rules";

export const RULES_QUERY_KEY = ["rules"]

export const rulesQuery = () => useQuery({
	queryKey: RULES_QUERY_KEY,
	queryFn: () => getRules(),
	refetchOnWindowFocus: false,
	refetchOnMount: false
})
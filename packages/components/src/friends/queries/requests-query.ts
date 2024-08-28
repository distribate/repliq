import { useQuery } from '@tanstack/react-query';
import { getRequests } from "./get-requests.ts";

export const REQUESTS_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", "requests", nickname ]
}

export const requestsQuery = (
	nickname?: string
) => {
	return useQuery({
		queryKey: REQUESTS_QUERY_KEY(nickname),
		queryFn: () => getRequests(nickname),
		refetchOnWindowFocus: false,
		enabled: !!nickname
	})
}
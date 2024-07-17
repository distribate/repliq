import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { useQuery } from "@tanstack/react-query";
import { getIncomingRequests } from "./get-incoming-requests.ts";

export const REQUESTS_INCOMING_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", "incoming", nickname ]
}

export const requestsIncomingQuery = () => {
	const { data: currentUser } = currentUserQuery()
	
	return useQuery({
		queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser?.nickname),
		queryFn: () => getIncomingRequests(currentUser?.nickname),
		enabled: !!currentUser && !!currentUser.nickname
	})
}
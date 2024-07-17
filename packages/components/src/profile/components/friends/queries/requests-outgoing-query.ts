import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { useQuery } from "@tanstack/react-query";
import { getOutgoingRequests } from "./get-outgoing-requests.ts";

export const REQUESTS_OUTGOING_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", "outgoing", nickname ]
}

export const requestsOutgoingQuery = () => {
	const { data: currentUser } = currentUserQuery()
	
	return useQuery({
		queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser?.nickname),
		queryFn: () => getOutgoingRequests(currentUser?.nickname),
		enabled: !!currentUser && !!currentUser.nickname
	})
}
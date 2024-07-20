import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOutgoingRequests } from "./get-outgoing-requests.ts";

export const REQUESTS_OUTGOING_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", "outgoing", nickname ]
}

export const requestsOutgoingQuery = () => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	return useQuery({
		queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser?.nickname),
		queryFn: () => getOutgoingRequests(currentUser?.nickname),
		enabled: !!currentUser && !!currentUser.nickname
	})
}
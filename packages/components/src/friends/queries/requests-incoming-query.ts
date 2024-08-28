import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getIncomingRequests } from "./get-incoming-requests.ts";

export const REQUESTS_INCOMING_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", "incoming", nickname ]
}

export const requestsIncomingQuery = (enabled: boolean = true) => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	return useQuery({
		queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser?.nickname),
		queryFn: () => getIncomingRequests(currentUser?.nickname),
		enabled: !!currentUser && !!currentUser.nickname && enabled
	})
}
import { useQuery } from '@tanstack/react-query';
import { getRequests } from "./get-requests.ts";
import { FriendsRequestsProperties } from '#friends/types/friends-requests-types.ts';

export const REQUESTS_QUERY_KEY = (nickname?: string) =>
	[ "user", "friends", "requests", nickname ]

export const requestsQuery = (
	nickname: Pick<FriendsRequestsProperties, "nickname">["nickname"]
) => {
	return useQuery({
		queryKey: REQUESTS_QUERY_KEY(nickname),
		queryFn: () => getRequests(nickname),
		refetchOnWindowFocus: false,
		enabled: !!nickname
	})
}
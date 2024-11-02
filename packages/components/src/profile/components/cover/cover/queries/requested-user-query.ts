import { useQuery } from "@tanstack/react-query";
import { getRequestedUser, RequestedUser } from '@repo/lib/queries/get-requested-user.ts';

export const REQUESTED_USER_QUERY_KEY = (nickname?: string) => [ "user", "requested", nickname ]

export const requestedUserQuery = (nickname?: string) => {
	return useQuery<RequestedUser | null, Error>({
		queryKey: REQUESTED_USER_QUERY_KEY(nickname),
		queryFn: () => getRequestedUser(nickname)
	})
}
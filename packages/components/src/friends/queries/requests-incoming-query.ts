import { useQuery } from '@tanstack/react-query';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { getRequestsByType } from '#friends/queries/get-requests-by-type.ts';
import { FriendRequestEntity } from '@repo/types/entities/entities-type.ts';

export const REQUESTS_INCOMING_QUERY_KEY = (nickname?: string) =>
	[ "user", "friends", "incoming", nickname ]

export const requestsIncomingQuery = (
	enabled: boolean = true
) => {
	const currentUser = getUser();
	
	return useQuery<FriendRequestEntity[], Error>({
		queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser?.nickname),
		queryFn: () => getRequestsByType({
			type: 'incoming', nickname: currentUser?.nickname
		}),
		enabled: !!currentUser && enabled
	})
}
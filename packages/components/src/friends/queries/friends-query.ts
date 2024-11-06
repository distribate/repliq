import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getFriends } from "./get-friends.ts";
import { friendsSortQuery } from '#profile/components/friends/hooks/use-friends-sort.tsx';

export const FRIENDS_QUERY_KEY = (nickname?: string) =>
	[ "user", "friends", nickname ]

export type FriendsQuery = {
	nickname: string,
	enabled?: boolean
}

export const friendsQuery = ({
	nickname, enabled = true
}: FriendsQuery) => {
	const { data: friendSortType } = friendsSortQuery();
	
	return useQuery({
		queryKey: FRIENDS_QUERY_KEY(nickname),
		queryFn: () => getFriends({ nickname, orderType: friendSortType.type }),
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		enabled: !!nickname && enabled
	})
}
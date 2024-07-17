import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { friendsSortQuery } from "../hooks/use-friends-sort.tsx";

export const FRIENDS_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", nickname ]
}

export const friendsQuery = (
	nickname?: string,
) => {
	const { data: friendSortType } = friendsSortQuery()
	
	return useQuery({
		queryKey: FRIENDS_QUERY_KEY(nickname),
		queryFn: () => getFriends({
			nickname: nickname,
			orderType: friendSortType.type
		}),
		refetchOnWindowFocus: true,
		retry: 2,
		placeholderData: keepPreviousData,
		enabled: !!nickname
	})
}
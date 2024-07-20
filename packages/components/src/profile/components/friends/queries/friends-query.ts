import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { friendsSortQuery } from "../hooks/use-friends-sort.tsx";

export const FRIENDS_QUERY_KEY = (nickname?: string) => {
	return [ "user", "friends", nickname ]
}

export type FriendsQuery = {
	nickname: string,
	description: string,
	status: string,
	name_color: string,
}

export const friendsQuery = ({
	nickname
}: Pick<FriendsQuery, "nickname">) => {
	const { data: friendSortType } = friendsSortQuery()
	
	return useQuery<FriendsQuery[], Error>({
		queryKey: FRIENDS_QUERY_KEY(nickname),
		queryFn: () => getFriends({
			nickname: nickname, orderType: friendSortType.type
		}),
		initialData: [],
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		enabled: !!nickname
	})
}
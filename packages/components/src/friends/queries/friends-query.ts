import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { friendsSortQuery } from '../../profile/components/friends/hooks/use-friends-sort.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';

export const FRIENDS_QUERY_KEY = (nickname?: string) => [ "user", "friends", nickname ]

export type FriendsQuery = {
	friend_id: string,
	created_at: string,
	isPinned: boolean,
	note: string | null,
} & Pick<UserEntity, "nickname"
	| "status"
	| "description"
	| "real_name"
	| "name_color"
>

export const friendsQuery = ({
	nickname
}: Pick<FriendsQuery, "nickname">) => {
	const { data: friendSortType } = friendsSortQuery()
	
	return useQuery<FriendsQuery[] | null, Error>({
		queryKey: FRIENDS_QUERY_KEY(nickname),
		queryFn: () => getFriends({
			nickname, orderType: friendSortType.type
		}),
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		enabled: !!nickname
	})
}
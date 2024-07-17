"use client"

import { RequestFriends } from "../queries/get-friends.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Suspense } from "react";
import { FriendsListSkeleton } from "./friends-list-skeleton.tsx";
import { FriendCard } from "../../../../friend/components/friend-card/friend-card.tsx";
import { friendsQuery } from "../queries/friends-query.ts";
import { friendsSortQuery } from "../hooks/use-friends-sort.tsx";
import dynamic from "next/dynamic";
import { SomethingError } from "../../../../templates/something-error.tsx";

const FriendsNotFound = dynamic(() =>
	import("../../../../templates/section-not-found.tsx")
	.then(m => m.ContentNotFound)
)

type FriendsSearch = {
	nickname: string
}

function filterFriendsByNickname(data: FriendsSearch[], query: string) {
	return data.filter(
		item => item.nickname.startsWith(query)
	);
}

const FilteredNotFound = ({
		value
	}: { value?: string }
) => {
	return (
		<Typography>
			Ничего не нашлось по запросу "{value}"
		</Typography>
	)
}

export const FriendsList = ({
	nickname
}: RequestFriends) => {
	const { data: friendsSortState } = friendsSortQuery()
	const { data: friendsData, isLoading, isError } = friendsQuery(nickname)
	
	if (isLoading) return <FriendsListSkeleton/>
	
	if (!friendsData || isError) return <SomethingError/>
	
	const friends = friendsSortState.search ? filterFriendsByNickname(
		friendsData, friendsSortState.search
	) : friendsData;
	
	if (friendsData.length === 0) return <FriendsNotFound title="Друзей пока нет."/>
	if (friends.length === 0) return <FilteredNotFound value={friendsSortState.search}/>
	
	if (!nickname) return;
	
	return (
		<Suspense fallback={
			<FriendsListSkeleton/>
		}>
			<div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
				{friends.map((friend, i) => (
					<FriendCard
						key={i}
						nickname={friend.nickname}
						reqUserNickname={nickname}
					/>
				))}
			</div>
		</Suspense>
	)
}
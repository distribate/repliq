"use client"

import { friendsQuery } from "../queries/friends-query.ts";
import { FriendsSearch } from "./friends-search.tsx";
import { FriendsSort } from "./friends-sort.tsx";

type FriendsFilteringProps = {
	nickname: string
}

export const FriendsFiltering = ({
	nickname
}: FriendsFilteringProps) => {
	const { data: friends } = friendsQuery(nickname);
	
	if (friends && !friends.length) return null;
	
	return (
		<div className="flex items-center justify-between">
			<FriendsSearch/>
			<FriendsSort/>
		</div>
	)
}
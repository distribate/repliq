"use client"

import { friendsQuery } from "./queries/friends-query.ts";

export const FriendsTrigger = ({
	nickname
}: {
	nickname: string
}) => {
	const { data: friends } = friendsQuery(nickname);
	
	return (
		<span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-emerald-500">
			{friends?.length || 0}
		</span>
	)
}
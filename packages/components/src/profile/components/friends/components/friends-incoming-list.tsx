"use client"

import { TabsContent } from "@repo/ui/src/components/tabs.tsx";
import { FriendRequestCard } from "../../../../friend/components/request-card/components/friend-request-card.tsx";
import { requestsIncomingQuery } from "../queries/requests-incoming-query.ts";

export const FriendsIncomingList = () => {
	const { data: inComingRequests } = requestsIncomingQuery()
	
	if (inComingRequests && !inComingRequests.length) return null;
	
	return (
		<TabsContent value="requests">
			<div className="flex flex-col gap-2 w-full">
				{inComingRequests?.map((item, i) => (
					<FriendRequestCard
						key={i}
						recipient={item.recipient}
						initiator={item.initiator}
						type="incoming"
					/>
				))}
			</div>
		</TabsContent>
	)
}
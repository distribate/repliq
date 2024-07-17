"use client"

import { TabsContent } from "@repo/ui/src/components/tabs.tsx";
import { FriendRequestCard } from "../../../../friend/components/request-card/components/friend-request-card.tsx";
import { requestsOutgoingQuery } from "../queries/requests-outgoing-query.ts";

export const FriendsOutgoingList = () => {
	const { data: outgoingRequests } = requestsOutgoingQuery()
	
	if (outgoingRequests && !outgoingRequests.length) return null;
	
	return (
		<TabsContent value="requests">
			<div className="flex flex-col gap-2 w-full">
				{outgoingRequests?.map((item, i) => (
					<FriendRequestCard
						key={i}
						recipient={item.recipient}
						initiator={item.initiator}
						type="outgoing"
					/>
				))}
			</div>
		</TabsContent>
	)
}
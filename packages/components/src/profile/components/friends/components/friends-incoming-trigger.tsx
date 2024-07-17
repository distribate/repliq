"use client"

import { requestsIncomingQuery } from "../queries/requests-incoming-query.ts";
import { TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";

export const FriendsIncomingTrigger = () => {
	const { data: incomingRequests } = requestsIncomingQuery()
	
	if (incomingRequests && !incomingRequests.length) return null;
	
	return (
		<>
			<Separator orientation="vertical"/>
			<TabsTrigger value="requests">
				<div className="flex items-center gap-1">
					Входящие
					<span
						className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
					{incomingRequests?.length || 0}
				</span>
				</div>
			</TabsTrigger>
		</>
	)
}
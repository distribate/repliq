"use client"

import { Separator } from "@repo/ui/src/components/separator.tsx";
import { TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { requestsOutgoingQuery } from "../queries/requests-outgoing-query.ts";

export const FriendsOutgoingTrigger = () => {
	const { data: outgoingRequests } = requestsOutgoingQuery()
	
	if (outgoingRequests && !outgoingRequests.length) return null;
	
	return (
		<>
			<Separator orientation="vertical"/>
			<TabsTrigger value="requests">
				<div className="flex items-center gap-1">
					Исходящие
					<span
						className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
					{outgoingRequests?.length || 0}
				</span>
				</div>
			</TabsTrigger>
		</>
	)
}
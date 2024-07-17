"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export type FriendsRequests = "incoming" | "outgoing";

type RequestsProperties = {
	type: FriendsRequests,
	nickname?: string
}

async function getRequestsByType({
	type, nickname
}: RequestsProperties) {
	const supabase = createClient();
	
	const requestType = type === 'incoming' ? 'recipient' : 'initiator'
	
	return supabase
	.from("friends_requests")
	.select("recipient, initiator, created_at")
	.eq(requestType, nickname)
}

export { getRequestsByType }
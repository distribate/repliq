"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { RequestFriendProperties } from "../types/request-friend-properties-type.ts";

export async function removeFriendRequest({
	recipient, initiator
}: RequestFriendProperties) {
	const supabase = createClient()
	
	return supabase
	.from("friends_requests")
	.delete()
	.eq(`recipient`, recipient)
	.eq('initiator', initiator)
	.select()
}
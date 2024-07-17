"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { RequestFriendProperties } from "../types/request-friend-properties-type.ts";

export async function createFriendRequest({
	...values
}: RequestFriendProperties) {
	const supabase = createClient()
	
	return supabase.from("friends_requests").insert(values).select()
}
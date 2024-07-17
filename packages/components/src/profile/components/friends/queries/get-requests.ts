"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export async function getRequests(
	nickname?: string
) {
	const supabase = createClient()
	
	const { data, error } = await supabase
	.from("friends_requests")
	.select("recipient, initiator, created_at")
	.or(`initiator.eq.${nickname},recipient.eq.${nickname}`)
	
	if (error) throw error;
	
	return data;
}
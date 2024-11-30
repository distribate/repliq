"use server"

import "server-only"
import { createClient } from "../../../../lib/utils/api/supabase-client.ts";
import { FriendsRequestsProperties } from '#friends/types/friends-requests-types.ts';

export async function getRequests(
	nickname: Pick<FriendsRequestsProperties, "nickname">["nickname"]
) {
	if (!nickname) return;
	
	const api = createClient();
	
	const { data, error } = await api
	.from("friends_requests")
	.select("recipient, initiator, created_at")
	.or(`initiator.eq.${nickname},recipient.eq.${nickname}`)
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data;
}
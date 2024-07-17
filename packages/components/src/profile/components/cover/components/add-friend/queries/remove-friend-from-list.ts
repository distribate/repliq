"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export async function removeFriend(
	currentUserNickname: string, requestedUserNickname: string
) {
	const supabase = createClient();
	
	return supabase.from("users_friends").delete()
	.or(`user_1.eq.${currentUserNickname},and(user_2.eq.${requestedUserNickname}),user_1.eq.${requestedUserNickname},and(user_2.eq.${currentUserNickname})`)
}
"use server"

import { getCurrentUser } from "../actions/get-current-user.ts";
import { createClient } from "../utils/supabase/server.ts";

type CheckIsFriend = {
	requestedUserNickname: string
}

export async function checkIsFriend({
	requestedUserNickname,
}: CheckIsFriend): Promise<boolean> {
	const currentUser = await getCurrentUser();
	
	const supabase = createClient();
	
	if (!currentUser) return false;
	
	const { data, error } = await supabase
		.from("users_friends")
		.select("user_1,user_2")
		.or(`user_1.eq.${requestedUserNickname},user_2.eq.${requestedUserNickname}`);
	
	if (error || !data) return true;
	
	return data.some((friendship) =>
		[ friendship.user_1, friendship.user_2 ].includes(currentUser.nickname)
	);
}
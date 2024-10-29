"use server"

import { getCurrentUser } from "../actions/get-current-user.ts";
import { createClient } from "@repo/lib/utils/api/server.ts";

type CheckIsFriend = {
	requestedUserNickname: string
}

export async function checkIsFriend({
	requestedUserNickname,
}: CheckIsFriend): Promise<boolean> {
	const currentUser = await getCurrentUser();
	if (!currentUser) return false;
	
	const api = createClient();
	
	const { data, error } = await api
		.from("users_friends")
		.select("user_1,user_2")
		.or(`user_1.eq.${requestedUserNickname},user_2.eq.${requestedUserNickname}`);
	
	if (error || !data) return true;
	
	return data.some((friendship) =>
		[ friendship.user_1, friendship.user_2 ].includes(currentUser.nickname)
	);
}
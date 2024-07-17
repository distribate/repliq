"use server"

import { getUserInformation } from "../queries/get-user-information.ts";
import { checkIsFriend } from "./check-is-friend.ts";
import { USER } from "@repo/types/entities/entities-type.ts"

export async function checkProfileToIsPrivate(
	requestedUser: USER
) {
	const currentUser = await getUserInformation()
	
	const currentUserNickname = currentUser.nickname;
	const requestedUserNickname = requestedUser.nickname;
	
	if (!currentUserNickname || !requestedUserNickname) return false;
	
	if (currentUserNickname === requestedUserNickname) return false;
	
	switch(requestedUser.visibility) {
		case 'all':
			return false;
		case 'friends':
			const isFriend = await checkIsFriend({
				requestedUserNickname: requestedUserNickname
			})
			
			return !isFriend;
		default:
			return true;
	}
}
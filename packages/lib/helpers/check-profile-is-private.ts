'use server';

import { checkIsFriend } from './check-is-friend.ts';
import { CheckProfileStatus } from './check-profile-status.ts';

export async function checkProfileIsPrivate({
	requestedUser, currentUserNickname
}: CheckProfileStatus) {
	const requestedUserNickname = requestedUser.nickname;
	
	if (!currentUserNickname || !requestedUserNickname) return true;
	if (currentUserNickname === requestedUserNickname) return true;
	
	switch(requestedUser.visibility) {
		case 'all':
			return true;
		case 'friends':
			return await checkIsFriend(requestedUserNickname);
		default:
			return false;
	}
}
'use server';

import { checkIsFriend } from './check-is-friend.ts';
import { CheckProfileStatus } from './check-profile-status.ts';
import { RequestedUser } from '#queries/get-requested-user.ts';

type CheckProfileIsPrivate = {
	requestedUser: RequestedUser;
	currentUserNickname: string
}

export async function checkProfileIsPrivate({
	requestedUser, currentUserNickname
}: CheckProfileIsPrivate) {
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
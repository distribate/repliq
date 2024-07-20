import { CURRENT_USER_QUERY_KEY } from '../queries/current-user-query.ts';
import { friendsQuery } from "@repo/components/src/profile/components/friends/queries/friends-query.ts";
import { requestsQuery } from "@repo/components/src/profile/components/friends/queries/requests-query.ts";
import { useQueryClient } from '@tanstack/react-query';
import { USER } from '@repo/types/entities/entities-type.ts';

type ReqStatus = "reject"
	| "accept"
	| "deny"
	| "default"
	| "friend"

export function checkFriendRequestStatus(
	reqUserNickname?: string
): ReqStatus | null {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<USER>(CURRENT_USER_QUERY_KEY);
	
	if (!currentUser) return null;
	
	const { data: rq } = requestsQuery(currentUser.nickname);
	const { data: friends } = friendsQuery({
		nickname: currentUser.nickname
	})
	
	if (!currentUser) return null;
	
	const currentUserNickname = currentUser.nickname;
	
	const inComingRequests = rq?.filter(
		i => i.recipient === currentUserNickname
	);
	
	const outgoingRequests = rq?.filter(
		i => i.initiator === currentUserNickname
	);
	
	if (outgoingRequests && outgoingRequests.length) {
		if (outgoingRequests.some(
			item => item.recipient === reqUserNickname &&
				item.initiator === currentUserNickname
		)) return "deny"
	}
	
	if (inComingRequests && inComingRequests.length) {
		if (inComingRequests.some(
			item => item.recipient === currentUserNickname &&
				item.initiator === reqUserNickname
		)) return "accept"
	}
	
	const isFriend = friends?.some(
		item => item.nickname === reqUserNickname
	);
	
	if (isFriend) return "friend";
	
	return "default"
}
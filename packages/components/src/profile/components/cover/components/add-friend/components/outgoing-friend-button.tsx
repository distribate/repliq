import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriend } from "../hooks/use-control-friend.ts";
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { USER } from '@repo/types/entities/entities-type.ts';

export type FriendButtonProps = {
	reqUserNickname: string
}

export const OutgoingFriendButton = ({
	reqUserNickname
}: FriendButtonProps) => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<USER>(CURRENT_USER_QUERY_KEY)
	
	const { removeRequestMutation } = useControlFriend()
	
	if (!currentUser) return;
	
	const handleDeniedFriendReq = () => {
		removeRequestMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: reqUserNickname
		})
	}
	
	return (
		<Button onClick={handleDeniedFriendReq} variant="pending">
			Отменить заявку
		</Button>
	)
}
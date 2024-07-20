import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriend } from "../hooks/use-control-friend.ts";
import { FriendButtonProps } from "./outgoing-friend-button.tsx";
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { USER } from '@repo/types/entities/entities-type.ts';

export const DeleteFriendButton = ({
	reqUserNickname
}: FriendButtonProps) => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<USER>(CURRENT_USER_QUERY_KEY)
	
	const { removeFriendFromListMutation } = useControlFriend()

	if (!currentUser) return null;
	
	const handleDeleteFriend = () => {
		removeFriendFromListMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: reqUserNickname
		})
	}
	
	return (
		<Button onClick={handleDeleteFriend} variant="negative">
			Удалить из друзей
		</Button>
	)
}
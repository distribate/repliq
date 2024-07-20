import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriend } from "../hooks/use-control-friend.ts";
import { FriendButtonProps } from "./outgoing-friend-button.tsx";
import { useQueryClient } from '@tanstack/react-query';
import { USER } from '@repo/types/entities/entities-type.ts';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';

export const AddFriendButton = ({
	reqUserNickname
}: FriendButtonProps) => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<USER>(CURRENT_USER_QUERY_KEY)
	
	const { addRequestFriendMutation, } = useControlFriend();
	
	if (!currentUser) return;
	
	const handleAddFriend = () => {
		addRequestFriendMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: reqUserNickname
		})
	}
	
	return (
		<Button onClick={handleAddFriend} variant="positive">
			Добавить в друзья
		</Button>
	)
}
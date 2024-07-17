import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriend } from "../hooks/use-control-friend.ts";
import { FriendButtonProps } from "./outgoing-friend-button.tsx";

export const DeleteFriendButton = ({
	requestedUserNickname, currentUser
}: FriendButtonProps) => {
	const { removeFriendFromListMutation } = useControlFriend()

	if (!currentUser) return null;
	
	const handleDeleteFriend = () => {
		removeFriendFromListMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: requestedUserNickname
		})
	}
	
	return (
		<Button onClick={handleDeleteFriend} variant="negative">
			Удалить из друзей
		</Button>
	)
}
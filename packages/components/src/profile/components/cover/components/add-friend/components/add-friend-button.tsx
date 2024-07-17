import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriend } from "../hooks/use-control-friend.ts";
import { FriendButtonProps } from "./outgoing-friend-button.tsx";

export const AddFriendButton = ({
	requestedUserNickname, currentUser
}: FriendButtonProps) => {
	const { addRequestFriendMutation, } = useControlFriend();
	
	const handleAddFriend = () => {
		addRequestFriendMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: requestedUserNickname
		})
	}
	
	return (
		<Button onClick={handleAddFriend} variant="positive">
			Добавить в друзья
		</Button>
	)
}
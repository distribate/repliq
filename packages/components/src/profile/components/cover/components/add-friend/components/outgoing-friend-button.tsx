import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriend } from "../hooks/use-control-friend.ts";
import { User } from "lucia";

export type FriendButtonProps = {
	currentUser: User,
	requestedUserNickname: string
}

export const OutgoingFriendButton = ({
	requestedUserNickname, currentUser
}: FriendButtonProps) => {
	const { removeRequestMutation } = useControlFriend()
	
	const handleDeniedFriendReq = () => {
		removeRequestMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: requestedUserNickname
		})
	}
	
	return (
		<Button onClick={handleDeniedFriendReq} variant="pending">
			Отменить заявку
		</Button>
	)
}
import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriendRequests } from '#friend/components/friend-card/hooks/use-control-friend-requests.ts';
import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';

export const DeleteFriendButton = ({
	recipient: reqUserNickname
}: Pick<FriendRequestProperties, "recipient">) => {
	const { removeFriendMutation } = useControlFriendRequests()
	
	const handleDeleteFriend = () => {
		return removeFriendMutation.mutate({ reqUserNickname })
	}
	
	return (
		<Button
			onClick={handleDeleteFriend}
			disabled={removeFriendMutation.isPending || removeFriendMutation.isError}
			variant="negative"
		>
			Удалить из друзей
		</Button>
	)
}
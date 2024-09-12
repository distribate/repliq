import { Button } from "@repo/ui/src/components/button.tsx";
import { RequestFriendProperties } from '../types/request-friend-properties-type.ts';
import { useControlFriend } from '../../../../../../friend/components/request-card/hooks/use-control-friend.ts';

export const DeleteFriendButton = ({
	recipient
}: RequestFriendProperties) => {
	const { removeFriendFromListMutation } = useControlFriend()
	
	const handleDeleteFriend = () => {
		removeFriendFromListMutation.mutate({
			reqUserNickname: recipient
		})
	}
	
	return (
		<Button
			onClick={handleDeleteFriend}
			disabled={removeFriendFromListMutation.isPending || removeFriendFromListMutation.isError}
			variant="negative"
		>
			Удалить из друзей
		</Button>
	)
}
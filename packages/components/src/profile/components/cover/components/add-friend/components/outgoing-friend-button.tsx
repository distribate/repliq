import { Button } from "@repo/ui/src/components/button.tsx";
import { RequestFriendProperties } from '../types/request-friend-properties-type.ts';
import { useControlFriend } from '../../../../../../friend/components/request-card/hooks/use-control-friend.ts';

export const OutgoingFriendButton = ({
	recipient
}: RequestFriendProperties) => {
	const { deleteRequestMutation } = useControlFriend()
	
	const handleDeniedFriendReq = () => {
		deleteRequestMutation.mutate({
			reqUserNickname: recipient
		})
	}
	
	return (
		<Button
			onClick={handleDeniedFriendReq}
			variant="pending"
			pending={deleteRequestMutation.isPending}
			disabled={deleteRequestMutation.isPending || deleteRequestMutation.isError}
		>
			Отменить заявку
		</Button>
	)
}
import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriendRequests } from '#friend/components/friend-card/hooks/use-control-friend-requests.ts';
import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';

export const OutgoingFriendButton = ({
	recipient
}: Pick<FriendRequestProperties, "recipient">) => {
	const { rejectOutgoingRequestMutation } = useControlFriendRequests()
	
	const handleDeniedFriendReq = () => {
		return rejectOutgoingRequestMutation.mutate(recipient);
	}
	
	return (
		<Button
			onClick={handleDeniedFriendReq}
			variant="pending"
			disabled={rejectOutgoingRequestMutation.isPending || rejectOutgoingRequestMutation.isError}
		>
			Отменить заявку
		</Button>
	)
}
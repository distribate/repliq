"use client"

import { Button } from "@repo/ui/src/components/button.tsx";
import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';
import { useControlFriendRequests } from '#friend/components/friend-card/hooks/use-control-friend-requests.ts';

export const AddFriendButton = ({
	recipient
}: Pick<FriendRequestProperties, "recipient">) => {
	const { createRequestFriendMutation } = useControlFriendRequests();

	const handleAddFriend = () => {
		return createRequestFriendMutation.mutate(recipient)
	}
	
	return (
		<Button
			onClick={handleAddFriend}
			variant="positive"
			disabled={createRequestFriendMutation.isPending || createRequestFriendMutation.isError}
		>
			Добавить в друзья
		</Button>
	)
}
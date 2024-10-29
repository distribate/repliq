"use client"

import { Button } from "@repo/ui/src/components/button.tsx";
import { RequestFriendProperties } from '../types/request-friend-properties-type.ts';
import { useControlFriend } from '../../../../../../friend/components/request-card/hooks/use-control-friend.ts';

export const AddFriendButton = ({
	recipient
}: RequestFriendProperties) => {
	const { createRequestFriendMutation } = useControlFriend();

	const handleAddFriend = () => {
		createRequestFriendMutation.mutate({
			reqUserNickname: recipient
		})
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
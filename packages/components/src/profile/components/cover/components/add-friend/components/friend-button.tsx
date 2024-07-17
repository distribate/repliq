"use client"

import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { checkFriendRequestStatus } from "@repo/lib/helpers/check-friend-request-status.ts";
import { IncomingFriendButton } from "./incoming-friend-button.tsx";
import { OutgoingFriendButton } from "./outgoing-friend-button.tsx";
import { AddFriendButton } from "./add-friend-button.tsx";
import { DeleteFriendButton } from "./delete-friend-button.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

type AddFriendButtonProps = {
	requestedUserNickname: string
}

const FriendButtonSkeleton = () => {
	return (
		<Skeleton className="h-10 rounded-md w-60"/>
	)
}

export const FriendButton = ({
	requestedUserNickname
}: AddFriendButtonProps) => {
	const { data: currentUser, isLoading } = currentUserQuery()
	
	const reqStatus = checkFriendRequestStatus(requestedUserNickname)
	
	if (isLoading) return <FriendButtonSkeleton/>
	
	if (!currentUser || !reqStatus) return null;
	
	return (
		<>
			{reqStatus === 'friend' && (
				<DeleteFriendButton
					currentUser={currentUser}
					requestedUserNickname={requestedUserNickname}
				/>
			)}
			{reqStatus === 'default' && (
				<AddFriendButton
					currentUser={currentUser}
					requestedUserNickname={requestedUserNickname}
				/>
			)}
			{reqStatus === 'accept' && <IncomingFriendButton/>}
			{reqStatus === 'deny' && (
				<OutgoingFriendButton
					currentUser={currentUser}
					requestedUserNickname={requestedUserNickname}
				/>
			)}
		</>
	)
}
import { FriendCardSkeleton } from "../../../../friend/components/friend-card/friend-card-skeleton.tsx";

export const FriendsListSkeleton = () => {
	return (
		<div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
			<FriendCardSkeleton/>
			<FriendCardSkeleton/>
			<FriendCardSkeleton/>
		</div>
	)
}
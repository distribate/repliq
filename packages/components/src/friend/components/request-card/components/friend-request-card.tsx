import { getSkinDetails } from "@repo/lib/helpers/get-skin-details.ts";
import { FriendsRequests } from "../../../../profile/components/friends/queries/get-requests-by-type.ts";
import { CardIncomingPart } from "./friend-request-card-incoming.tsx";
import { CardOutgoingPart } from "./friend-request-card-outgoing.tsx";
import { Avatar } from "../../../../user/components/avatar/components/avatar.tsx";

export type FriendRequestCardProps = {
	initiator: string,
	recipient: string,
	type: FriendsRequests
}

export const FriendRequestCard = ({
	initiator, type, recipient
}: FriendRequestCardProps) => {
	
	return (
		<div className="flex items-center justify-between gap-x-4 px-4 py-2 bg-shark-900 w-full rounded-md">
			<Avatar nickname={type === 'outgoing' ? recipient : initiator} propWidth={36} propHeight={36} />
			{type === 'outgoing' && <CardOutgoingPart recipient={recipient}  initiator={initiator}/>}
			{type === 'incoming' && <CardIncomingPart recipient={recipient} initiator={initiator}/>}
		</div>
	)
}
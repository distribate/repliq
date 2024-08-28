import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useControlFriendRequests } from "../hooks/use-control-friend-requests.ts";
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { UserNickname } from '../../../../user/components/name/components/nickname.tsx';
import { UserDonate } from '../../../../user/components/donate/components/donate.tsx';
import { FriendRequestProperties } from '../../types/friend-request-types.ts';

export const FriendRequestIncomingCard = ({
	initiator
}: Pick<FriendRequestProperties, "initiator">) => {
	const {
		rejectIncomingRequestMutation,
		acceptIncomingRequestMutation
	} = useControlFriendRequests()
	
	const handleAcceptReq = () => {
		acceptIncomingRequestMutation.mutate(initiator)
	}
	
	const handleRejectReq = () => {
		rejectIncomingRequestMutation.mutate({
			initiator, type: "incoming"
		})
	}
	
	return (
		<div
			key={initiator}
			className="flex items-center gap-4 w-full bg-shark-950 border border-shark-800 rounded-lg p-4"
		>
			<Avatar
				nickname={initiator}
				propHeight={112}
				propWidth={112}
				className="rounded-lg"
			/>
			<div className="flex flex-col gap-y-1 w-fit">
				<div className="flex items-center gap-1 w-fit">
					<Link href={USER_URL + initiator} className="flex items-center gap-1">
						<UserNickname nickname={initiator} className="text-lg" />
					</Link>
					<UserDonate nickname={initiator} />
				</div>
				<div className="flex items-center mt-2 gap-1 w-fit">
					<Button
						onClick={handleAcceptReq}
						variant="positive"
					>
						<Typography textSize="small">
							Принять заявку
						</Typography>
					</Button>
					<Button
						onClick={handleRejectReq}
						variant="negative"
					>
						<Typography textSize="small">
							Отклонить заявку
						</Typography>
					</Button>
				</div>
			</div>
		</div>
	)
}
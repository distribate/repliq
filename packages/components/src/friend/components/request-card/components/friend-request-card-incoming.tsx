import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { FriendRequestCardProps } from "./friend-request-card.tsx";
import { useControlRequests } from "../hooks/use-control-requests.ts";

export const CardIncomingPart = ({
	initiator, recipient
}: Omit<FriendRequestCardProps, "type">) => {
	const {
		rejectIncomingRequestMutation,
		acceptIncomingRequestMutation
	} = useControlRequests()
	
	const handleAcceptReq = () => {
		acceptIncomingRequestMutation.mutate({
			initiator: initiator,
			recipient: recipient
		})
	}
	
	const handleRejectReq = () => {
		rejectIncomingRequestMutation.mutate({
			initiator: initiator,
			recipient: recipient
		})
	}
	
	return (
		<>
			<div className="flex flex-row w-full items-center gap-1">
				<Link href={`/user/${initiator}`}>
					<Typography className="text-pink-500 text-md font-medium">
						{initiator}
					</Typography>
				</Link>
				<Typography className="text-md font-medium text-shark-50">
					хочет добавить вас в друзья
				</Typography>
			</div>
			<div className="flex items-center gap-2 w-fit">
				<Button
					onClick={handleAcceptReq}
					className="hover:bg-emerald-700/40 bg-emerald-600/40"
				>
					<Typography className="text-md font-bold">
						принять заявку
					</Typography>
				</Button>
				<Button
					onClick={handleRejectReq}
					className="hover:bg-red-700/40 bg-red-600/40"
				>
					<Typography className="text-md font-bold">
						отклонить заявку
					</Typography>
				</Button>
			</div>
		</>
	)
}
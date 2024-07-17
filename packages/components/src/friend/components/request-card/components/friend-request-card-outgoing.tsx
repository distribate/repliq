import { Typography } from "@repo/ui/src/components/typography.tsx";
import Link from "next/link";
import { Button } from "@repo/ui/src/components/button.tsx";
import { FriendRequestCardProps } from "./friend-request-card.tsx";
import { useControlRequests } from "../hooks/use-control-requests.ts";

export const CardOutgoingPart = ({
	initiator, recipient
}: Omit<FriendRequestCardProps, "type">) => {
	const { rejectIncomingRequestMutation } = useControlRequests()
	
	const handleRejectReq = () => {
		rejectIncomingRequestMutation.mutate({
			initiator: initiator,
			recipient: recipient
		})
	}
	
	return (
		<>
			<div className="flex flex-row w-full items-center gap-1">
				<Typography className="text-md font-medium text-shark-50">
					запрос отправлен игроку
				</Typography>
				<Link href={`/user/${recipient}`}>
					<Typography className="text-pink-500 text-md font-medium">
						{recipient}
					</Typography>
				</Link>
			</div>
			<div className="flex items-center gap-2 w-fit">
				<Button onClick={handleRejectReq} className="hover:bg-red-700/40 bg-red-600/40">
					<Typography className="text-md font-bold">
						отменить заявку
					</Typography>
				</Button>
			</div>
		</>
	)
}
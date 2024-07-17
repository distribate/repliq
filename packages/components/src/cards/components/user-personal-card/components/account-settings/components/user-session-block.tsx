import Image from "next/image";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DialogWrapper } from "../../../../../../wrappers/dialog-wrapper.tsx";
import { X } from "lucide-react";
import {
	TerminateSessionModal
} from "../../../../../../modals/action-confirmation/components/terminate-session/components/terminate-session-modal.tsx";
import { Session } from "@repo/types/entities/entities-type.ts";
import BlockGold from "@repo/assets/images/minecraft/block_gold.webp"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UserSessionBlockProps = Partial<Session> & {
	current?: boolean
};

const SELECTED_SESSION_ID_QUERY_KEY = [
	"user", "selected-session-id"
]

export const useSelectSessionId = () => {
	const qc = useQueryClient()
	
	const setValueMutation = useMutation({
		mutationFn: async(
			value: string
		) => {
			qc.setQueryData(
				SELECTED_SESSION_ID_QUERY_KEY,
				() => {
					return value
				}
			)
		},
		onSuccess: async () => {
			await qc.invalidateQueries({
				queryKey: SELECTED_SESSION_ID_QUERY_KEY
			})
		}
	})
	
	return { setValueMutation }
}

export const selectedSessionIdQuery = () => {
	return useQuery<string, Error>({
		queryKey: SELECTED_SESSION_ID_QUERY_KEY
	})
}

export const UserSessionBlock = ({
	current, browser, os, id, user_id, ua, cpu, isBot
}: UserSessionBlockProps) => {
	const { setValueMutation } = useSelectSessionId()
	
	const isCurrent = current || false;
	
	if (!id) return null;
	
	return (
		<div className="flex w-full gap-2 py-2 hover:bg-white/10 px-4">
			<Image
				src={BlockGold.src}
				alt="Page private"
				width={64}
				className={`w-[64px] h-[64px] ${!isCurrent ? 'grayscale' : 'grayscale-0'}`}
				height={64}
			/>
			<div className="flex flex-col grow">
				<div className="flex w-full justify-between grow items-center">
					<Typography>
						{browser}
					</Typography>
					<div
						className="flex items-center px-1"
					>
						<DialogWrapper
							trigger={
								<div onClick={() => setValueMutation.mutate(id)} className="cursor-pointer">
									<X className="h-4 w-4 text-shark-200 hover:text-shark-50"/>
								</div>
							}
							name="terminate-session"
						>
							<TerminateSessionModal/>
						</DialogWrapper>
					</div>
				</div>
				<Typography>
					{os}
				</Typography>
			</div>
		</div>
	)
}
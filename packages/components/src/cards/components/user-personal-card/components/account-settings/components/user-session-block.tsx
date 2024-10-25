import Image from "next/image";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import BlockGold from "@repo/assets/images/minecraft/block_gold.webp"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TerminateSessionModal } from '../../../../../../modals/user-settings/terminate-session-modal.tsx';
import { Session } from '@repo/lib/actions/terminate-session.ts';

export type UserSessionBlockProps = Partial<Session> & {
	current?: boolean
};

const SELECTED_SESSION_ID_QUERY_KEY = [
	"user", "selected-session-id"
]

export const useSelectSessionId = () => {
	const qc = useQueryClient()
	
	const setValueMutation = useMutation({
		mutationFn: async(value: string) => {
			qc.setQueryData(SELECTED_SESSION_ID_QUERY_KEY, () => { return value })
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: SELECTED_SESSION_ID_QUERY_KEY })
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
	const isCurrent = current || false;
	
	if (!id) return null;
	
	return (
		<div className="flex w-full gap-2 py-2 rounded-md hover:bg-white/10 px-4">
			<Image
				src={BlockGold.src}
				alt="Page private"
				width={64}
				className={`w-[64px] h-[64px] ${!isCurrent ? 'grayscale' : 'grayscale-0'}`}
				height={64}
			/>
			<div className="flex flex-col grow">
				<div className="flex w-full justify-between grow items-center">
					<Typography>{browser}</Typography>
					<div className="flex items-center px-1">
						<TerminateSessionModal id={id}/>
					</div>
				</div>
				<Typography>{os}</Typography>
			</div>
		</div>
	)
}
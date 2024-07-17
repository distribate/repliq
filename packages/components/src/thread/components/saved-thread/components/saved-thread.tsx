import { X } from "lucide-react";
import { Avatar } from "../../../../user/components/avatar/components/avatar.tsx";
import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import React from "react";
import { useSaveLastThread } from "../hooks/use-save-last-thread.tsx";
import { SavedThreadType } from "../types/saved-thread-types.ts";
import { HoverCardWrapper } from "../../../../wrappers/hover-card-wrapper.tsx";
import { THREAD_URL } from '@repo/shared/constants/routes.ts';

type SavedTopicProps = {
	type: "compact" | "full",
	index?: number,
} & SavedThreadType

export const SavedThread = ({
	id, title, nickname, type = "full", index
}: SavedTopicProps) => {
	const { deleteThread } = useSaveLastThread()
	
	return (
		type === 'compact' ? (
			<HoverCardWrapper
				properties={{ sideAlign: "right", contentAlign: "start" }}
				trigger={
					<div className="flex relative bg-white/10 h-[50px] w-[50px] rounded-md p-1">
						<Avatar nickname={nickname} propHeight={32} propWidth={32}/>
						<div className="absolute bottom-0 -right-2 rounded-md h-[20px] w-[20px]">
							<Typography className="text-sm text-shark-300 font-[Minecraft]">{index}</Typography>
						</div>
					</div>
				}
				content={
					<div className="flex flex-col gap-y-1 relative">
						<div
							onClick={() => deleteThread({ id: id })}
							className="absolute top-1 right-1 cursor-pointer hover:opacity-50"
						>
							<X className="w-3 h-3"/>
						</div>
						<Link href={THREAD_URL + id}>
							<Typography textSize="small" textColor="shark_white">
								{title}
							</Typography>
						</Link>
						<Typography className="text-[12px] text-shark-300">Игрок: {nickname}</Typography>
					</div>
				}
			/>
		) : (
			<div className="flex gap-2 relative items-center bg-white/10 rounded-md p-2 w-full">
				<div
					onClick={() => deleteThread({ id: id })}
					className="absolute top-2 right-2 cursor-pointer hover:opacity-50"
				>
					<X className="w-3 h-3"/>
				</div>
				<Avatar
					nickname={nickname}
					className="min-h-[24px] min-w-[24px] max-w-[24px] max-h-[24px]"
					propHeight={24}
					propWidth={24}
				/>
				<div className="flex flex-col max-w-fit truncate overflow-hidden">
					<Link href={THREAD_URL + id}>
						<Typography textSize="small" textColor="shark_white" className="truncate">{title}</Typography>
					</Link>
					<Typography className="text-[12px] text-shark-300">{nickname}</Typography>
				</div>
			</div>
		)
	)
}
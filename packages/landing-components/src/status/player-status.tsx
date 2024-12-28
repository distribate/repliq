"use client"

import { Typography } from "@repo/landing-ui/src/typography";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@repo/landing-ui/src/dialog";
import { PlayerStatusImage } from "@repo/landing-components/src/status/player-status-image";
import Link from "next/link";

export type PlayerStatusProps = {
	nickname: string
}

export const PlayerStatus = ({
	nickname
}: PlayerStatusProps) => {
	return (
		<Dialog>
			<DialogTrigger className="w-fit">
				<div
					title="Перейти к игроку"
					className="flex items-center w-fit pl-2 pr-4 py-1 rounded-[4px]
					 hover:bg-white/10 cursor-pointer justify-start gap-2"
				>
					<PlayerStatusImage nickname={nickname}/>
					<Typography>{nickname}</Typography>
				</div>
			</DialogTrigger>
			<DialogContent className="justify-center max-w-xl">
				<DialogTitle className="text-center">{nickname}</DialogTitle>
				<div className="flex flex-col items-center gap-8 w-full">
					<PlayerStatusImage type="full" nickname={nickname}/>
					<div className="flex flex-col gap-4 w-full">
						<Link
							href={`https://forum.fasberry.su/user/${nickname}`}
							target="_blank"
							className="inline-flex items-center justify-center whitespace-nowrap
							px-4 py-2 hover:bg-[#77DD77] bg-[#5CC85C] rounded-[6px] w-full"
						>
							<Typography className="text-neutral-900 text-[18px]">
								Перейти к профилю
							</Typography>
						</Link>
						<DialogClose className="w-full">
							<div
								className="inline-flex items-center justify-center whitespace-nowrap
								px-4 py-2 hover:bg-[#E66A6D] bg-[#C65558] rounded-[6px] w-full"
							>
								<Typography className="text-neutral-900 text-[18px]">
									Закрыть
								</Typography>
							</div>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
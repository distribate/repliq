"use client"

import { Typography } from "#/ui/typography";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "#/ui/dialog";
import { Button } from "#/ui/button";
import { useRouter } from "next/navigation";
import { PlayerStatusImage } from "#/components/status/player-status-image";

export type PlayerStatusProps = {
	nickname: string
}

export const PlayerStatus = ({
	nickname
}: PlayerStatusProps) => {
	const { push } = useRouter()
	
	const handleUserProfile = () => {
		push(`https://forum.fasberry.su/user/${nickname}`)
	}
	
	return (
		<Dialog>
			<DialogTrigger>
				<div
					title="Перейти к игроку"
					className="flex items-center w-fit px-2 py-1 rounded-[4px] hover:bg-white/10 cursor-pointer justify-start gap-2"
				>
					<PlayerStatusImage nickname={nickname}/>
					<Typography>
						{nickname}
					</Typography>
				</div>
			</DialogTrigger>
			<DialogContent className="justify-center max-w-xl">
				<DialogTitle className="text-center">{nickname}</DialogTitle>
				<div className="flex flex-col items-center gap-8 w-full">
					<PlayerStatusImage type="full" nickname={nickname}/>
					<div className="flex flex-col gap-4 w-full">
						<Button
							onClick={handleUserProfile}
							className="bg-green-server-color rounded-[8px]"
						>
							<Typography className="text-neutral-800 text-[18px]">
								Перейти к профилю
							</Typography>
						</Button>
						<DialogClose className="w-full">
							<Button className="bg-red-server-color rounded-[8px] w-full">
								<Typography className="text-neutral-50 text-[18px]">
									Закрыть
								</Typography>
							</Button>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
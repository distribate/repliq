"use client"

import { Typography } from "@repo/landing-ui/src/typography"
import { Block } from "@repo/landing-ui/src/block"
import { serverStatusQuery } from "@repo/lib/queries/server-status-query";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@repo/landing-ui/src/hover-card";
import { useRouter } from "next/navigation";

export const StatusItem = () => {
	const { data: status, isLoading } = serverStatusQuery(25565);
	const { push } = useRouter()

	const serverOnline = status ? status?.players?.online ? status?.players.online : 0 : 0
	const serverStatus = status ? status?.online ? 'работает!' : "не работает" : "не работает"
	
	const handleToStatusPage = () => push("/status")
	
	return (
		<HoverCard openDelay={4} closeDelay={1}>
			<HoverCardTrigger>
				<Block
					onClick={handleToStatusPage}
					blockItem
					type="column"
					size="normal"
					rounded="big"
					className="h-max gap-y-4 cursor-pointer"
				>
					<Typography text_color="adaptiveWhiteBlack" className="text-xl lg:text-2xl">
						Статус
					</Typography>
					<div className="flex flex-col items-start gap-y-2">
						<div className="flex flex-row items-center gap-x-2">
							<Typography text_color="adaptiveWhiteBlack" className="text-base md:text-lg lg:text-xl">
								Состояние:
							</Typography>
							{isLoading ? (
								<Typography
									text_color="adaptiveWhiteBlack"
									suppressHydrationWarning
									className="text-md sm:text-base md:text-lg lg:text-xl"
								>
									работает?
								</Typography>
							) : (
								<Typography
									suppressHydrationWarning
									text_color="adaptiveWhiteBlack"
									className="text-md sm:text-base md:text-lg lg:text-xl"
								>
									{serverStatus}
								</Typography>
						)}
						</div>
						<div className="flex flex-row items-center gap-x-2">
							<Typography text_color="adaptiveWhiteBlack" className="text-md sm:text-base md:text-lg lg:text-xl">
								Сейчас на сервере:
							</Typography>
							{isLoading ? (
								<Typography suppressHydrationWarning text_color="adaptiveWhiteBlack" className="text-md sm:text-base md:text-lg lg:text-xl">
									0 игроков
								</Typography>
							) : (
								<Typography suppressHydrationWarning text_color="adaptiveWhiteBlack" className="text-md sm:text-base md:text-lg lg:text-xl">
									{serverOnline} игроков
								</Typography>
							)}
						</div>
					</div>
				</Block>
			</HoverCardTrigger>
			<HoverCardContent className="w-[400px] relative bg-black border-none p-2 rounded-xl">
				<Typography text_color="gray" className="text-lg">
					Перейти на страницу мониторинга
				</Typography>
			</HoverCardContent>
		</HoverCard>
	)
}
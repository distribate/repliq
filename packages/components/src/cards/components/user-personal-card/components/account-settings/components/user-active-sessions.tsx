import { Typography } from "@repo/ui/src/components/typography.tsx";
import { userActiveSessionsQuery } from "../queries/user-sessions-query.ts";
import Barrier from "@repo/assets/images/minecraft/barrier.webp"
import { ImageWrapper } from "../../../../../../wrappers/image-wrapper.tsx";
import { UserSessionBlock } from "./user-session-block.tsx";
import dynamic from "next/dynamic";

const DialogWrapper = dynamic(() =>
	import("../../../../../../wrappers/dialog-wrapper.tsx")
	.then(m => m.DialogWrapper)
)

const TerminateNotActiveSessionsModal = dynamic(() =>
	import("../../../../../../modals/action-confirmation/components/terminate-session/components/terminate-not-active-sessions-modal.tsx")
	.then(m => m.TerminateNotActiveSessionsModal)
)

const HoverCardItem = dynamic(() =>
	import("@repo/ui/src/components/hover-card.tsx")
	.then(m => m.HoverCardItem)
)

export const UserActiveSessions = () => {
	const { data: activeSessions, isError } = userActiveSessionsQuery()

	const currentSession = activeSessions ? activeSessions.find(
		item => item ? item.current : null
	) : null;
	
	if (isError || !currentSession || !activeSessions) return;
	
	return (
		<div className="flex flex-col gap-y-2 w-full pt-4">
			<div className="flex flex-col gap-y-2 w-full">
				<div className="flex flex-col gap-y-2 w-full">
					<Typography className="text-xl text-shark-50 font-semibold px-4">
						Текущая сессия
					</Typography>
					<UserSessionBlock{...currentSession}/>
				</div>
				{activeSessions.length > 1 && (
					<DialogWrapper
						trigger={
							<HoverCardItem className="gap-2 px-2">
								<ImageWrapper
									propSrc={Barrier.src}
									propAlt="Page private"
									width={32}
									className="max-w-[40px] max-h-[40px]"
									height={32}
								/>
								<Typography className="text-base">
									Выйти с остальных сессий
								</Typography>
							</HoverCardItem>
						}
						name="terminate-all-not-active-sessions"
					>
						<TerminateNotActiveSessionsModal/>
					</DialogWrapper>
				)}
			</div>
			{activeSessions.length > 1 && (
				<>
					<div className="bg-shark-800 w-full py-2 px-4">
						<Typography className="text-shark-200 text-sm">
							Будут уничтожены все сессии, кроме текущей.
						</Typography>
					</div>
					<div className="flex flex-col w-full gap-y-2">
						<Typography className="text-xl text-shark-50 font-semibold px-4">
							Активные сессии
						</Typography>
						<div className="flex flex-col gap-y-1 w-full">
							{activeSessions.map((item, i) => (
								<UserSessionBlock key={i} {...item}/>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	)
}
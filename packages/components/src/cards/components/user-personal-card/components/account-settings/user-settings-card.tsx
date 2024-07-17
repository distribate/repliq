import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { userActiveSessionsQuery } from "./queries/user-sessions-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { DialogWrapper } from "../../../../../wrappers/dialog-wrapper.tsx";
import { UserActiveSessions } from "./components/user-active-sessions.tsx";
import YellowCandle from "@repo/assets/images/minecraft/yellow_candle.webp"
import IronHelmet from "@repo/assets/images/minecraft/iron_helmet.webp"
import FancyFeather from "@repo/assets/images/minecraft/fancy_feather.webp"
import { ImageWrapper } from "../../../../../wrappers/image-wrapper.tsx";
import AllaySpawnEgg from "@repo/assets/images/minecraft/allay_spawn_egg.webp"
import { Separator } from "@repo/ui/src/components/separator.tsx";
import WildArmorTrim from "@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp"

export const UserSettingsCard = () => {
	const { data: activeSessions, isLoading } = userActiveSessionsQuery()
	
	return (
		<div className="flex flex-col gap-y-4 items-center w-full">
			<Typography className="text-xl text-shark-50 font-semibold">
				Аккаунт
			</Typography>
			<div className="flex flex-col gap-y-6 w-full">
				<div className="flex flex-col gap-y-4 w-full">
					<Typography textSize="medium" textColor="shark_white" className="font-semibold px-4">
						Защита
					</Typography>
					<DialogWrapper
						name="active-sessions"
						trigger={
							<HoverCardItem className="justify-between w-full">
								<div className="flex gap-x-2 items-center w-full px-2">
									<ImageWrapper
										propSrc={YellowCandle?.src}
										width={32}
										height={32}
										loading="eager"
										propAlt="Change description"
									/>
									<Typography className="text-base">
										Активные сессии
									</Typography>
								</div>
								{isLoading ? (
									<Skeleton className="rounded-md h-4 w-4"/>
								) : (
									<Typography className="text-base">
										{activeSessions?.length}
									</Typography>
								)}
							</HoverCardItem>
						}
					>
						<UserActiveSessions/>
					</DialogWrapper>
					<div className="flex flex-col bg-white/10 w-full py-2 px-4">
						<Typography className="text-base text-shark-200">
							Управление текущими сессиями
						</Typography>
					</div>
					<Separator/>
				</div>
				<div className="flex flex-col gap-y-4 w-full">
					<Typography textSize="medium" textColor="shark_white" className="font-semibold px-4">
						Приватность
					</Typography>
					<div className="flex flex-col gap-y-2 w-full">
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full px-2">
								<ImageWrapper
									propSrc={WildArmorTrim?.src}
									width={32}
									height={32}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Игровая статистика
								</Typography>
							</div>
							<Typography className="text-base">
								скрыта
							</Typography>
						</HoverCardItem>
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full px-2">
								<ImageWrapper
									propSrc={FancyFeather?.src}
									width={32}
									height={32}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Реальное имя
								</Typography>
							</div>
							<Typography className="text-base">
								скрыто
							</Typography>
						</HoverCardItem>
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full px-2">
								<ImageWrapper
									propSrc={AllaySpawnEgg?.src}
									width={32}
									height={32}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Заявки в друзья
								</Typography>
							</div>
							<Typography className="text-base">
								выкл.
							</Typography>
						</HoverCardItem>
						<DialogWrapper
							name="active-sessions"
							trigger={
								<HoverCardItem className="justify-between w-full">
									<div className="flex gap-x-2 items-center w-full px-2">
										<ImageWrapper
											propSrc={IronHelmet?.src}
											width={32}
											height={32}
											loading="eager"
											propAlt="Change description"
										/>
										<Typography className="text-base">
											Черный список
										</Typography>
									</div>
									{isLoading ? (
										<Skeleton className="rounded-md h-4 w-4"/>
									) : (
										<Typography className="text-base">
											{activeSessions?.length}
										</Typography>
									)}
								</HoverCardItem>
							}
						>
							<UserActiveSessions/>
						</DialogWrapper>
						<div className="flex flex-col bg-white/10 w-full py-2 px-4">
							<Typography className="text-base text-shark-200">
								Приватность профиля и аккаунта
							</Typography>
						</div>
						<Separator/>
					</div>
				</div>
			</div>
			<div className="w-full">
				<HoverCardItem>
					<div className="flex px-4 w-full">
						<Typography className="text-red-500" textSize="medium">
							Удалить аккаунт
						</Typography>
					</div>
				</HoverCardItem>
			</div>
		</div>
	)
}
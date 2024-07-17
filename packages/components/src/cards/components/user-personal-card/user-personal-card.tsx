import { ImageWrapper } from "../../../wrappers/image-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { DialogWrapper } from "../../../wrappers/dialog-wrapper.tsx";
import { UserProfileSettings } from "./components/profile-settings/user-profile-settings.tsx";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp"
import { Avatar } from "../../../user/components/avatar/components/avatar.tsx";
import { UserNickname } from "../../../user/components/name/components/nickname.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { UserSettingsCard } from "./components/account-settings/user-settings-card.tsx";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp"
import Campfire from "@repo/assets/images/minecraft/campfire.webp"
import { UserAdvancedSettings } from "./components/advanced-settings/user-advanced-settings.tsx";
import Portfolio from "@repo/assets/images/minecraft/portfolio.webp"
import { TicketsMenu } from "./components/tickets/tickets-menu.tsx";

export const UserPersonalCard = () => {
	const { data: currentUser } = currentUserQuery();

	if (!currentUser) return;
	
	const {
		nickname,
		name_color
	} = currentUser;
	
	return (
		<div className="flex flex-col gap-y-4 pt-4 items-center w-full">
			<Avatar
				propHeight={96}
				propWidth={96}
				nickname={nickname}
			/>
			<div className="flex flex-col items-center">
				<UserNickname
					nickname={nickname}
					nicknameColor={name_color}
					className="text-base font-bold"
				/>
				<Typography>
					онлайн
				</Typography>
			</div>
			<Separator/>
			<div className="flex flex-col w-full gap-y-4">
				<DialogWrapper
					name="profile-settings"
					trigger={
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full">
								<ImageWrapper
									propSrc={BookAndQuill?.src}
									width={26}
									height={26}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Профиль
								</Typography>
							</div>
						</HoverCardItem>
					}
				>
					<UserProfileSettings/>
				</DialogWrapper>
				<DialogWrapper
					name="account-settings"
					trigger={
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full">
								<ImageWrapper
									propSrc={MinecartWithChest?.src}
									width={26}
									height={26}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Аккаунт
								</Typography>
							</div>
						</HoverCardItem>
					}
				>
					<UserSettingsCard/>
				</DialogWrapper>
				<DialogWrapper
					name="advanced-settings"
					trigger={
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full">
								<ImageWrapper
									propSrc={Campfire?.src}
									width={26}
									height={26}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Прочее
								</Typography>
							</div>
						</HoverCardItem>
					}
				>
					<UserAdvancedSettings/>
				</DialogWrapper>
				<Separator/>
				<DialogWrapper
					name="ticket-menu"
					trigger={
						<HoverCardItem className="justify-between w-full">
							<div className="flex gap-x-2 items-center w-full">
								<ImageWrapper
									propSrc={Portfolio?.src}
									width={26}
									height={26}
									loading="eager"
									propAlt="Change description"
								/>
								<Typography className="text-base">
									Задать вопрос
								</Typography>
							</div>
						</HoverCardItem>
					}
				>
					<TicketsMenu/>
				</DialogWrapper>
			</div>
		</div>
	)
}
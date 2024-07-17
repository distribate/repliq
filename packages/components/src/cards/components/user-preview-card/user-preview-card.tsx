import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardWrapper } from "../../../wrappers/hover-card-wrapper.tsx";
import Link from "next/link";
import { USER } from "@repo/types/entities/entities-type.ts"
import { Avatar } from "../../../user/components/avatar/components/avatar.tsx";
import { UserNickname } from "../../../user/components/name/components/nickname.tsx";
import { UserDonate } from "../../../user/components/donate/components/donate.tsx";

interface UserCardProps {
	user: Pick<USER, "nickname"
		| "description"
		| "created_at"
		| "name_color"
	>
}

export const UserPreviewCard = ({
	user
}: UserCardProps) => {

	if (!user) return;
	
	return (
		<HoverCardWrapper
			properties={{
				sideAlign: "left",
				contentAlign: "start",
				contentClassname: "min-w-[300px]"
			}}
			trigger={
				<div className="flex gap-2 items-center px-2 py-1 cursor-pointer">
					<Avatar propHeight={18} propWidth={18} nickname={user.nickname}/>
					<UserNickname
						nickname={user.nickname}
						nicknameColor={user.name_color}
						className="text-sm font-normal"
					/>
				</div>
			}
			content={
				<div className="flex flex-col w-full">
					<div className="flex flex-col px-4 py-2 w-full">
						<div className="flex gap-2 items-center w-full">
							<div className="h-[52px] w-[52px]">
								<Avatar
									propHeight={52}
									propWidth={52}
									nickname={user.nickname}
								/>
							</div>
							<div className="flex flex-col justify-start w-full">
								<div className="flex items-center gap-1 -mt-2">
									<Link href={`/user/${user.nickname}`} className="max-w-[140px]">
										<UserNickname
											nickname={user.nickname}
											nicknameColor={user.name_color}
											className="text-base font-normal truncate"
										/>
									</Link>
									<UserDonate nickname={user.nickname}/>
								</div>
								<Typography textShadow="small" textSize="medium" className="text-shark-200 font-normal">
									На проекте с 2024
								</Typography>
							</div>
						</div>
					</div>
					<div className="flex flex-row bg-shark-900 px-4 py-1">
						asdasd
					</div>
				</div>
			}
		/>
	)
}
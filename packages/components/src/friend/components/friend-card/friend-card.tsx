import { Typography } from "@repo/ui/src/components/typography.tsx";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { HoverCardWrapper } from "../../../wrappers/hover-card-wrapper.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { useControlFriend } from "../../../profile/components/cover/components/add-friend/hooks/use-control-friend.ts";
import { Avatar } from "../../../user/components/avatar/components/avatar.tsx";
import { UserDonate } from "../../../user/components/donate/components/donate.tsx";

type FriendCardProps = {
	nickname: string,
	reqUserNickname: string
}

export const FriendCard = ({
	nickname, reqUserNickname
}: FriendCardProps) => {
	const { data: currentUser } = currentUserQuery()
	const { removeFriendFromListMutation } = useControlFriend()
	
	if (!currentUser) return null;

	const handleDeleteFriend = () => {
		removeFriendFromListMutation.mutate({
			currentUserNickname: currentUser.nickname,
			requestedUserNickname: reqUserNickname
		})
	}
	
	const isOwner = currentUser.nickname === reqUserNickname;
	
	return (
		<div className="flex flex-col gap-y-4 w-full p-4 bg-shark-900 rounded-md border border-shark-800/60">
			<div className="flex items-start justify-between w-full">
				<div className="flex gap-2 items-center">
					<Avatar propHeight={46} propWidth={46} nickname={nickname}/>
					<div className="flex flex-col">
						<Link href={`/user/${nickname}`}>
							<Typography className="text-lg font-semibold text-shark-50">
								{nickname}
							</Typography>
						</Link>
						<UserDonate nickname={nickname}/>
					</div>
				</div>
				{isOwner && (
					<HoverCardWrapper
						properties={{
							contentAlign: "end",
							sideAlign: "bottom",
							contentClassname: "w-[160px]"
						}}
						trigger={
							<Ellipsis size={22} className="text-shark-200 cursor-pointer"/>
						}
						content={
							<div onClick={handleDeleteFriend} className="flex flex-col gap-y-2">
								<div
									className="flex hover:bg-white/10 cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm relative">
									Удалить из друзей
								</div>
							</div>
						}
					/>
				)}
			</div>
			<div className="flex flex-col">
				<Typography className="text-shark-50 text-md">
					В игре: 5 дней 6 часов
				</Typography>
				<Typography className="text-green-500 text-md font-medium">
					онлайн
				</Typography>
			</div>
		</div>
	)
}
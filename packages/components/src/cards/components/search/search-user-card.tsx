import Link from "next/link";
import { Avatar } from "../../../user/components/avatar/components/avatar.tsx";
import { UserNickname } from "../../../user/components/name/components/nickname.tsx";
import { UserDonate } from "../../../user/components/donate/components/donate.tsx";

export const SearchUserItem = ({
	nickname, nicknameColor
}: UserNickname) => {
	return (
		<Link href={`/user/${nickname}`}>
			<div className="flex hover:bg-white/10 items-center rounded-md px-2 py-2 gap-2">
				<Avatar nickname={nickname} propHeight={16} propWidth={16}/>
				<div className="flex items-center gap-1">
					<UserNickname
						className="text-sm"
						nickname={nickname}
						nicknameColor={nicknameColor}
					/>
					<UserDonate nickname={nickname}/>
				</div>
			</div>
		</Link>
	)
}
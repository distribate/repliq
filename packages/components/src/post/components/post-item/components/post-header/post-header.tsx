import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "../../../../../user/components/avatar/components/avatar.tsx";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { UserNickname } from "../../../../../user/components/name/components/nickname.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts"
import Link from "next/link";
import dayjs from "dayjs"
import dynamic from 'next/dynamic';
import { useQueryClient } from '@tanstack/react-query';

type PostItemHeaderProps = Pick<UserEntity, "nickname"
	| "created_at"
	| "name_color"
	| "id"
>

const PostControl = dynamic(() =>
	import("./post-control.tsx")
	.then(m => m.PostControl)
)

export const PostItemHeader = ({
	nickname, created_at, name_color, id: post_id
}: PostItemHeaderProps) => {
	const qc = useQueryClient()
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	if (!currentUser) return null;
	
	const isOwner = currentUser.nickname === nickname;
	
	return (
		<div className="flex justify-between w-full items-center">
			<div className="flex gap-2 items-center">
				<Link href={`/user/${nickname}`}>
					<Avatar variant="page" propHeight={48} propWidth={48} nickname={nickname}/>
				</Link>
				<div className="flex flex-col gap-y-1">
					<Link href={`/user/${nickname}`}>
						<UserNickname nickname={nickname} nicknameColor={name_color} className="text-base font-medium" />
					</Link>
					<Typography className="text-shark-200 text-sm">
						{dayjs(created_at).format('DD.MM.YYYY HH:mm')}
					</Typography>
				</div>
			</div>
			{isOwner && (
				<PostControl post_id={post_id} nickname={nickname} name_color={name_color}/>
			)}
		</div>
	)
}
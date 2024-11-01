import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { UserRealName } from '#user/components/real-name/components/real-name.tsx';
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { COVER_QUERY_KEY, CoverQuery } from '../queries/cover-query.ts';
import { RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { checkUserRealNameVisibility } from '@repo/lib/helpers/check-user-real-name-visibility.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { REQUESTED_USER_QUERY_KEY } from '../queries/requested-user-query.ts';

type UserCoverInfoProps = {
	nickname: string
}

export const UserCoverMainInfo = ({
	nickname
}: UserCoverInfoProps) => {
	const qc = useQueryClient()
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	const reqUser = qc.getQueryData<RequestedUser>(REQUESTED_USER_QUERY_KEY(nickname));
	const coverState = qc.getQueryData<CoverQuery>(COVER_QUERY_KEY)
	
	if (!reqUser || !coverState || !currentUser) return;
	
	const { inView } = coverState;
	const { description, real_name, name_color, preferences } = reqUser;
	
	const isRealNameShow = checkUserRealNameVisibility({
		reqUserNickname: reqUser.nickname,
		preferences,
		currentUserNickname: currentUser.nickname
	})
	
	return (
		<div className="flex flex-col self-end justify-between h-1/2 gap-y-1">
			<div className="flex flex-col">
				<div className="flex items-center gap-1">
					<UserNickname
						nickname={nickname}
						nicknameColor={name_color}
						className={`${inView ? 'text-3xl' : 'text-xl'}`}
					/>
					<UserDonate nickname={nickname}/>
				</div>
				{(real_name && isRealNameShow) && <UserRealName real_name={real_name}/>}
			</div>
			{description && (
				<div className="flex">
					<Typography textColor="shark_white" className="font-[Minecraft]" textSize="medium">
						{description}
					</Typography>
				</div>
			)}
		</div>
	)
}
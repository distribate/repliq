import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { UserRealName } from '#user/components/real-name/components/real-name.tsx';
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { REQUESTED_USER_QUERY_KEY } from '#profile/components/cover/queries/requested-user-query.ts';
import { COVER_QUERY_KEY, CoverQuery } from '#profile/components/cover/queries/cover-query.ts';
import { getPreferenceValue, UserPreferences } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';

type UserCoverInfoProps = {
	nickname: string
}

type CheckUserRealNameVisibility = {
	preferences: UserPreferences,
	currentUserNickname: string,
	reqUserNickname: string
}

export function checkUserRealNameVisibility({
	reqUserNickname, currentUserNickname, preferences
}: CheckUserRealNameVisibility) {
	const isRealNameShow: boolean = getPreferenceValue(preferences, "realNameVisibility")
	
	if (currentUserNickname === reqUserNickname) return true;
	
	return isRealNameShow;
}

export const UserCoverMainInfo = ({
	nickname
}: UserCoverInfoProps) => {
	const qc = useQueryClient()
	const currentUser = getUser();
	const requestedUser = qc.getQueryData<RequestedUser>(REQUESTED_USER_QUERY_KEY(nickname));
	const coverState = qc.getQueryData<CoverQuery>(COVER_QUERY_KEY)
	
	if (!requestedUser || !coverState || !currentUser) return;
	
	const { description, real_name, name_color, preferences } = requestedUser;
	
	const isRealNameShow = checkUserRealNameVisibility({
		reqUserNickname: requestedUser.nickname,
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
						className={coverState.inView ? 'text-3xl' : 'text-xl'}
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
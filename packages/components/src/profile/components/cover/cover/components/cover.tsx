import { coverQuery } from "../queries/cover-query.ts";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { imageCoverQuery } from "../../components/cover-image/queries/image-cover-query.ts";
import { USER } from "@repo/types/entities/entities-type.ts"
import { Avatar } from "../../../../../user/components/avatar/components/avatar.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { DONATE_QUERY_KEY } from "../../../../../user/components/donate/queries/donate-query.ts";
import { DonateType } from "../../../../../user/components/donate/queries/get-user-donate.ts";
import { CoverArea } from './cover-area.tsx';
import { UserCoverMainInfo } from './cover-main-info.tsx';
import { UserCoverPanel } from './cover-panel.tsx';

type UserCoverProps = {
	requestedUser: USER
}

export const UserCover = ({
	requestedUser
}: UserCoverProps) => {
	const { data: coverQueryState } = coverQuery()
	const { data: currentUser } = currentUserQuery();
	
	const qc = useQueryClient();
	
	const userDonate = qc.getQueryData<
		DonateType["primary_group"]
	>(DONATE_QUERY_KEY(requestedUser.nickname));
	
	const { data: url } = imageCoverQuery({
		nickname: requestedUser.nickname
	})
	
	const inView = coverQueryState.inView;
	const isOwner = currentUser?.nickname === requestedUser?.nickname;
	
	const imageHeight = inView ? 168 : 76;
	
	const nickname = requestedUser.nickname;
	
	const borderColor = userDonate
		? userDonate === 'authentic'
			? 'border-[2px] border-authentic-background'
			: 'border-none'
		: ''
	
	return (
		<CoverArea
			variant={inView ? 'full' : 'compact'}
			backgroundColor={url ? 'transparent' : 'gray'}
			className={borderColor}
			style={{
				backgroundImage: url ? `url(${url})` : ''
			}}
		>
			<div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40"/>
			<div className="flex gap-x-6 z-[3] relative items-start">
				<Avatar
					variant="page"
					propHeight={imageHeight}
					propWidth={imageHeight}
					nickname={nickname}
					withBadge={{ noactive: true }}
				/>
				<UserCoverMainInfo nickname={nickname}/>
			</div>
			{currentUser && (
				<UserCoverPanel
					userByParamNickname={nickname}
					isOwner={isOwner}
					variant={inView ? 'end' : 'default'}
				/>
			)}
		</CoverArea>
	)
}
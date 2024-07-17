import { UserNickname } from "../../../../../user/components/name/components/nickname.tsx";
import { UserDonate } from "../../../../../user/components/donate/components/donate.tsx";
import { UserRealName } from "../../../../../user/components/real-name/components/real-name.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import { USER } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { COVER_QUERY_KEY, CoverQuery } from '../queries/cover-query.ts';

interface UserCoverInfo {
	nickname: string
}

type RequesterUserMainInfo = Pick<USER, "real_name"
	| "name_color"
	| "description"
>

export const UserCoverMainInfo = ({
	nickname
}: UserCoverInfo) => {
	const qc = useQueryClient()
	
	const reqUser = qc.getQueryData<RequesterUserMainInfo>(
		REQUESTED_USER_QUERY_KEY(nickname)
	);
	
	const coverState = qc.getQueryData<CoverQuery>(
		COVER_QUERY_KEY
	)
	
	if (!reqUser || !coverState) return;
	
	const { inView } = coverState;
	const { description, real_name, name_color } = reqUser;
	
	return (
		<div className="flex flex-col self-end justify-between h-1/2 gap-y-1">
			<div className="flex flex-col">
				<div className="flex items-center gap-1">
					<UserNickname nickname={nickname} nicknameColor={name_color} className={`${inView ? 'text-3xl' : 'text-xl'}`} />
					<UserDonate nickname={nickname}/>
				</div>
				{real_name && <UserRealName real_name={real_name}/>}
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
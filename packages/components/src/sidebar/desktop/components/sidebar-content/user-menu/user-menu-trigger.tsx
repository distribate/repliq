import { UserMenu } from "./user-menu.tsx";
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const UserMenuTrigger = () => {
	const currentUser = getUser();
	if (!currentUser) return null;
	
	const { isExpanded, isCompact } = useSidebarControl();
	
	return (
		<DropdownWrapper
			trigger={
				<div
					className={`flex gap-x-3 items-center hover:bg-shark-800 rounded-md w-full
					${!isCompact ? 'justify-start' : isExpanded ? 'justify-start' : 'justify-center'}`}
				>
					<Avatar
						variant="default"
						border="withBorder"
						className="overflow-hidden min-w-[48px] min-h-[48px]"
						propWidth={48}
						propHeight={48}
						nickname={currentUser.nickname}
					/>
					{!isCompact && (
						<div className="flex flex-col items-start max-w-[200px] overflow-hidden">
							<UserNickname
								className="text-base truncate"
								nicknameColor={currentUser.name_color}
								nickname={currentUser.nickname}
							/>
							<UserDonate nickname={currentUser.nickname}/>
						</div>
					)}
				</div>
			}
			content={<UserMenu/>}
		/>
	)
}
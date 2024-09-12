import { SidebarItem } from "../../sidebar-item/sidebar-item.tsx";
import { UserMenu } from "./user-menu.tsx";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';
import { Avatar } from '../../../../../user/components/avatar/components/avatar.tsx';
import { DropdownWrapper } from '../../../../../wrappers/dropdown-wrapper.tsx';
import { UserDonate } from '../../../../../user/components/donate/components/donate.tsx';
import { UserNickname } from '../../../../../user/components/name/components/nickname.tsx';

export const UserMenuTrigger = () => {
	const qc = useQueryClient()
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	const { isExpanded, isCompact } = useSidebarControl();
	
	if (!currentUser) return;
	
	return (
		<DropdownWrapper
			trigger={
				<SidebarItem variant={!isCompact ? 'expanded' : isExpanded ? 'expanded' : 'compacted'}>
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
				</SidebarItem>
			}
			content={<UserMenu/>}
		/>
	)
}
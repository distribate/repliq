import Link from "next/link";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { useQueryClient } from '@tanstack/react-query';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserSettingsModal } from '../../../../modals/user-settings/user-settings-modal.tsx';
import { LogoutModal } from '../../../../modals/action-confirmation/components/logout/components/logout-modal.tsx';

export const UserMenu = () => {
	const qc = useQueryClient()
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)

	if (!currentUser) return null;
	
	return (
		<div className="flex flex-col gap-y-2 w-[200px]">
			<Link href={`/user/${currentUser.nickname}`}>
				<DropdownMenuItem>
					Перейти к профилю
				</DropdownMenuItem>
			</Link>
			<Separator/>
			<Link href="/?tab=my-threads">
				<DropdownMenuItem>
					Мои темы
				</DropdownMenuItem>
			</Link>
			{/* search - search page, filter - query param, 123 - user id */}
			<Link href="/search/?filter=123">
				<DropdownMenuItem>
					Мои сообщения
				</DropdownMenuItem>
			</Link>
			<Link href="/?tab=saved">
				<DropdownMenuItem>
					Сохранненое
				</DropdownMenuItem>
			</Link>
			<Separator/>
			<UserSettingsModal/>
			<Separator/>
			<LogoutModal
				trigger={
					<HoverCardItem>
						<Typography className="text-red-400">
							Выйти из аккаунта
						</Typography>
					</HoverCardItem>
				}
			/>
		</div>
	)
}
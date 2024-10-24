import Link from "next/link";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { useQueryClient } from '@tanstack/react-query';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { LogoutModal } from '../../../../../modals/action-confirmation/components/logout/components/logout-modal.tsx';
import { UserSettingsModal } from '../../../../../modals/user-settings/user-settings-modal.tsx';
import { useEffect, useState } from 'react';
import { checkAdminPermission } from '@repo/lib/actions/check-admin-permission.ts';

const COLLECTION_LINKS = [
	{ name: "Мои темы", query: "threads" },
	{ name: "Мои сообщения", query: "messages" },
	{ name: "Сохранненое",query: "saved" },
]

const AdminButton = () => {
	const [isAdmin, setIsAdmin] = useState<boolean>();
	
	useEffect(() => {
		checkAdminPermission()
		.then(result => setIsAdmin(result));
	}, []);
	
	if (!isAdmin) return null;
	
	return (
		<>
			<Link href="/admin">
				<DropdownMenuItem>
					К панели админа
				</DropdownMenuItem>
			</Link>
			<Separator/>
		</>
	)
}

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
			{COLLECTION_LINKS.map(collection => (
				<Link
					key={collection.name}
					href={`/collection?type=${collection.query}`}
				>
					<DropdownMenuItem>
						{collection.name}
					</DropdownMenuItem>
				</Link>
			))}
			<Separator/>
			<UserSettingsModal/>
			<Separator/>
			<AdminButton/>
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
import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DialogWrapper } from "../../../../wrappers/dialog-wrapper.tsx";
import {
	LogoutConfirmation
} from "../../../../modals/action-confirmation/components/logout/components/logout-confirmation.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { UserPersonalCard } from "../../../../cards/components/user-personal-card/user-personal-card.tsx";

export const UserMenu = () => {
	const { data: currentUser } = currentUserQuery()
	
	if (!currentUser) return null;
	
	const nickname = currentUser.nickname
	
	return (
		<div className="flex flex-col gap-y-2 w-[200px]">
			<Link href={`/user/${nickname}`}>
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
			<DialogWrapper
				name="settings-card"
				trigger={
					<HoverCardItem>
						Настройки
					</HoverCardItem>
				}
			>
				<UserPersonalCard/>
			</DialogWrapper>
			<Separator/>
			<DialogWrapper
				name="logout-confirm"
				trigger={
					<HoverCardItem>
						<Typography className="text-red-400">
							Выйти из аккаунта
						</Typography>
					</HoverCardItem>
				}
			>
				<LogoutConfirmation/>
			</DialogWrapper>
		</div>
	)
}
import { TabsList, TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Asterisk } from "@repo/ui/src/components/asterisk.tsx";
import { protectPrivateArea } from "@repo/lib/helpers/protect-private-area.ts";

type NavigationTabsListProps = {
	requestedUserNickname: string
}

export const NavigationTabsList = async({
	requestedUserNickname
}: NavigationTabsListProps) => {
	
	const isOwner = await protectPrivateArea({
		requestedUserNickname: requestedUserNickname
	});
	
	return (
		<TabsList className="flex justify-start gap-2 w-full">
			<TabsTrigger value="posts">Посты</TabsTrigger>
			<TabsTrigger value="topics">Темы</TabsTrigger>
			<TabsTrigger value="friends">Фанаты</TabsTrigger>
			<Separator orientation="vertical"/>
			<TabsTrigger value="game-stats">Игровая статистика</TabsTrigger>
			<TabsTrigger value="achievements">Достижения</TabsTrigger>
			{isOwner && (<>
					<Separator orientation="vertical"/>
					<TabsTrigger value="account-stats">
						Аккаунт
						<Asterisk/>
					</TabsTrigger>
				</>
			)}
		</TabsList>
	)
}
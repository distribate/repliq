import { validateRequest } from "@repo/lib/utils/auth/validate-requests.ts";
import { permanentRedirect } from "next/navigation";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserPreviewCard } from "@repo/components/src/cards/components/user-preview-card/user-preview-card.tsx";
import { MainCategoriesList } from "@repo/components/src/categories/components/main-categories-list.tsx";
import { MainAlertsList } from "@repo/components/src/alerts/components/main-alerts-list.tsx";
import { getLastUsers } from "@repo/lib/queries/get-last-registered-users.ts";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { hasAlertsShow } from "@repo/lib/actions/has-alerts.ts";
import { getStats } from "@repo/lib/queries/get-forum-stats.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Suspense } from "react";

const LastRegisteredUsers = async() => {
	const users = await getLastUsers();
	
	if (!users) return null;
	
	return (
		<div
			className="flex flex-col gap-y-4 w-full py-6 px-4 rounded-md border-[1px] overflow-hidden border-white/10 bg-shark-950">
			<div className="px-2">
				<Typography textSize="big" textColor="shark_white" className="font-semibold">
					Новые пользователи
				</Typography>
			</div>
			<div className="flex flex-col gap-y-1 hover:*:bg-shark-900/60 *:rounded-md">
				{users.map(user => (
					<UserPreviewCard user={user} key={user.nickname}/>
				))}
			</div>
		</div>
	)
}

const Statistics = async() => {
	const stats = await getStats();
	
	return (
		<div
			className="flex flex-col gap-y-4 w-full py-6 px-4 rounded-md border-[1px] overflow-hidden border-white/10 bg-shark-950">
			<div className="px-2">
				<Typography textSize="big" textColor="shark_white" className="font-semibold">
					Статистика
				</Typography>
			</div>
			<div className="flex flex-col gap-y-2">
				<div className="flex flex-col gap-y-2 px-2 py-1">
					<Typography>
						Пользователи
					</Typography>
					<div className="flex flex-col gap-y-1 w-full">
						<Typography>
							- зарегистрированных на форуме: {stats.usersRegisteredForum}
						</Typography>
						<Typography>
							- всего: {stats.usersRegisteredServer}
						</Typography>
					</div>
				</div>
				<Separator/>
				<div className="flex flex-col gap-y-2 px-2 py-1">
					<Typography>
						Треды
					</Typography>
					<div className="flex flex-col gap-y-1 w-full">
						<Typography>
							- создано за сегодня: 0
						</Typography>
						<Typography>
							- всего: {stats.topicsCreatedToday}
						</Typography>
					</div>
				</div>
			</div>
		</div>
	)
}

const MainContentSkeleton = () => {
	return (
		<div className="flex lg:flex-row flex-col w-full h-full">
			<div className="flex flex-col w-full pr-4 gap-y-4 min-h-[400px] h-full">
				<Skeleton className="rounded-md h-[200px] w-full"/>
				<Skeleton className="rounded-md h-[200px] w-full"/>
				<Skeleton className="rounded-md h-[200px] w-full"/>
				<Skeleton className="rounded-md h-[200px] w-full"/>
				<Skeleton className="rounded-md h-[200px] w-full"/>
			</div>
			<div className="flex flex-col gap-y-4 w-1/3 h-full">
				<Skeleton className="rounded-md h-[260px] w-full"/>
				<Skeleton className="rounded-md h-[310px] w-full"/>
			</div>
		</div>
	)
}

export default async function MainPage() {
	const { user } = await validateRequest();
	
	const hasAlertsShowing = await hasAlertsShow();
	
	if (!user) permanentRedirect("/auth?type=login");
	
	return (
		<main className="flex flex-col w-full gap-4">
			{hasAlertsShowing && (
				<div className="flex flex-col gap-y-2 w-full">
					<MainAlertsList/>
				</div>
			)}
			{/*<AdvertisementSection/>*/}
			<Suspense fallback={
				<MainContentSkeleton/>
			}>
				<div className="flex lg:flex-row overflow-y-scroll flex-col w-full h-full">
					<MainCategoriesList/>
					<div className="flex flex-col gap-y-4 w-1/3 h-full">
						<LastRegisteredUsers/>
						<Statistics/>
					</div>
				</div>
			</Suspense>
		</main>
	)
}
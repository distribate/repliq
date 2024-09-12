import { validateRequest } from "@repo/lib/utils/auth/validate-requests.ts";
import { permanentRedirect } from "next/navigation";
import { MainCategoriesList } from "@repo/components/src/categories/components/main-categories-list.tsx";
import { MainAlertsList } from "@repo/components/src/alerts/components/main-alerts-list.tsx";
import { hasAlertsShow } from "@repo/lib/actions/has-alerts.ts";
import { Suspense } from "react";
import { ForumStats } from '@repo/components/src/widgets/forum-stats/components/forum-stats.tsx';
import {
	LastRegisteredUsers
} from '@repo/components/src/widgets/last-registered-users/components/last-registered-users.tsx';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import {
	MainCategoriesListSkeleton
} from '@repo/components/src/categories/components/main-categories-list-skeleton.tsx';

export const dynamic = 'force-dynamic'

export default async function MainPage() {
	const { user } = await validateRequest();
	
	if (!user) permanentRedirect(AUTH_REDIRECT);
	
	const hasAlertsShowing = await hasAlertsShow();
	
	return (
		<main className="flex flex-col w-full gap-2 h-full">
			{hasAlertsShowing && (
				<div className="flex flex-col gap-2 w-full">
					<MainAlertsList/>
				</div>
			)}
			{/*<AdvertisementSection/>*/}
			<Suspense fallback={<MainCategoriesListSkeleton/>}>
				<div className="flex lg:flex-row gap-2 flex-col w-full h-full">
					<MainCategoriesList/>
					<div className="flex flex-col gap-4 w-full md:w-1/4 h-full">
						<LastRegisteredUsers/>
						<ForumStats/>
					</div>
				</div>
			</Suspense>
		</main>
	)
}
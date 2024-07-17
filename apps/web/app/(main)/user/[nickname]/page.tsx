import { Metadata } from "next";
import { MetadataType, PageConventionProps } from "@repo/types/config/page-types.ts";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { Tabs } from "@repo/ui/src/components/tabs.tsx";
import { getRequestedUser } from "@repo/lib/queries/get-requested-user.ts"
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import { UserCoverLayout } from "@repo/components/src/profile/components/cover/cover/components/cover-layout.tsx";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { checkProfileToIsPrivate } from "@repo/lib/helpers/check-profile-is-private.ts";
import { UserContentSkeleton } from "@repo/components/src/skeletons/user-content-skeleton.tsx";
import { ProfilePrivated } from "@repo/components/src/templates/profile-privated.tsx";
import {
	NavigationTabsList
} from "@repo/components/src/profile/components/navigation/components/navigation-tabs-list.tsx";
import dynamic from "next/dynamic";
import {
	NavigationTabsContent
} from "@repo/components/src/profile/components/navigation/components/navigation-tabs-content.tsx";

export async function generateMetadata({
	params
}: MetadataType): Promise<Metadata> {
	const { nickname } = params;
	
	return {
		title: nickname,
		description: `Профиль игрока ${nickname}`,
		keywords: [ nickname ? nickname : 'player', "profile", `profile of ${nickname}`, `fasberry profile player`, `${nickname} profile` ]
	}
}

const UserSkin = dynamic(() =>
	import("@repo/components/src/profile/components/skin/skin.tsx")
	.then(m => m.UserSkin)
)

export default async function ProfilePage({
	params
}: PageConventionProps) {
	const qc = new QueryClient()
	
	const { nickname: requestedUserNickname } = params;
	
	const requestedUser = await getRequestedUser({
		nickname: requestedUserNickname
	})
	
	if (typeof requestedUser === 'string') {
		return redirect(requestedUser)
	}
	
	await qc.prefetchQuery({
		queryKey: REQUESTED_USER_QUERY_KEY(requestedUserNickname),
		queryFn: () => getRequestedUser({
			nickname: requestedUserNickname
		})
	})
	
	const isPrivated = await checkProfileToIsPrivate(requestedUser);
	
	return (
		<div className="flex flex-col w-full relative">
			<HydrationBoundary state={dehydrate(qc)}>
				<UserCoverLayout reqUserNickname={requestedUserNickname}/>
			</HydrationBoundary>
			<Suspense fallback={
				<UserContentSkeleton/>
			}>
				{isPrivated ? (
					<ProfilePrivated/>
				) : (
					<Tabs
						id="main-content"
						defaultValue="posts"
						className="flex flex-col w-full h-full px-12 gap-y-6 pt-6 min-w-[400px] relative z-[4]"
					>
						<NavigationTabsList requestedUserNickname={requestedUserNickname}/>
						<div className="flex items-start gap-12 w-full">
							<NavigationTabsContent
								requestedUserNickname={requestedUserNickname}
								requestedUserUuid={requestedUser.uuid}
							/>
							<div className="flex flex-col w-1/3 h-full">
								<UserSkin userNicknameByParam={requestedUserNickname}/>
							</div>
						</div>
					</Tabs>
				)}
			</Suspense>
		</div>
	)
}
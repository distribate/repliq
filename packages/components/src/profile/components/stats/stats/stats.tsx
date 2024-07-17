import { UserPageParam } from "@repo/types/config/page-types.ts"
import { Suspense } from "react";
import { GeneralStats } from "../components/general/components/general-stats.tsx";
import { ClanStats } from "../components/clan/components/clan-stats.tsx";
import { LandsStats } from "../components/lands/components/lands-stats.tsx";
import { GeneralStatsSkeleton } from "../components/general/components/general-stats-skeleton.tsx";
import { LandsStatsSkeleton } from "../components/lands/components/lands-stats-skeleton.tsx";
import { getAllGeneralStats } from "../components/general/queries/get-general-stats.ts";
import { GENERAL_STATS_QUERY_KEY } from "../components/general/queries/general-stats-query.ts";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getLandsStats } from "../components/lands/queries/get-lands-stats.ts";
import { LANDS_STATS_QUERY_KEY } from "../components/lands/queries/lands-stats-query.ts";
import { ClanStatsSkeleton } from "../components/clan/components/clan-stats-skeleton.tsx";

export const UserGameStats = async({
	nickname, uuid
}: UserPageParam) => {
	const qc = new QueryClient()
	
	if (!nickname || !uuid) return null;
	
	await Promise.all([
		qc.prefetchQuery({
			queryKey: GENERAL_STATS_QUERY_KEY(nickname),
			queryFn: () => getAllGeneralStats({
				nickname: nickname, uuid: uuid
			}),
		}),
		qc.prefetchQuery({
			queryKey: LANDS_STATS_QUERY_KEY(nickname),
			queryFn: () => getLandsStats({
				nickname: nickname, uuid: uuid
			})
		})
	])
	
	return (
		<HydrationBoundary state={dehydrate(qc)}>
			<div className="flex flex-col w-full gap-y-4">
				<Suspense fallback={
					<GeneralStatsSkeleton/>
				}>
					<GeneralStats nickname={nickname} uuid={uuid}/>
				</Suspense>
				<Suspense fallback={
					<ClanStatsSkeleton/>
				}>
					<ClanStats nickname={nickname} uuid={uuid}/>
				</Suspense>
				<Suspense fallback={
					<LandsStatsSkeleton/>
				}>
					<LandsStats nickname={nickname} uuid={uuid}/>
				</Suspense>
			</div>
		</HydrationBoundary>
	)
}
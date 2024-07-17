"use client"

import { keyValueExtractor } from "@repo/lib/helpers/key-value-extractor.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { CornerDownRight } from "lucide-react";
import { StatsRequest } from "../../../types/stats-types.ts";
import { generalStatsQuery } from "../queries/general-stats-query.ts";
import { GeneralStatsSkeleton } from "./general-stats-skeleton.tsx";
import { BlockWrapper } from "../../../../../../wrappers/block-wrapper.tsx";

export const GeneralStats = ({
	nickname, uuid
}: StatsRequest) => {
	const { data: generalStats, isLoading } = generalStatsQuery({
		nickname: nickname,
		uuid: uuid
	})
	
	const extractedData = keyValueExtractor(
		generalStats?.cmi?.usermeta
	);
	
	const collectionPosters = extractedData ? extractedData["collection_posters"] : 0;
	
	const cmiData = generalStats?.cmi;
	const repData = generalStats?.rep;
	const pointsData = generalStats?.points
	
	if (isLoading) return <GeneralStatsSkeleton/>;

	if (!cmiData || !repData || !pointsData) return null;
	
	return (
		<BlockWrapper className="flex flex-col gap-y-2">
			<Typography textShadow="small" className="text-lg text-shark-50 font-semibold">
				Основное
			</Typography>
			<div className="flex flex-col gap-y-2">
				<Typography>
					Реальный ник: {nickname}
				</Typography>
				<Typography>
					Псевдоним: {cmiData?.username}
				</Typography>
				<div className="flex flex-col gap-y-1">
					<Typography>
						Баланс:
					</Typography>
					<div className="flex items-start gap-1">
						<CornerDownRight size={20}/>
						<div className="flex flex-col gap-y-1">
							<Typography>
								Харизма: {cmiData?.balance}
							</Typography>
							<Typography>
								Белкоины: {pointsData?.points}
							</Typography>
						</div>
					</div>
				</div>
				<Typography>
					Собрано постеров: {collectionPosters}/14
				</Typography>
				<Typography>
					Репутации: {repData?.reputation}
				</Typography>
				<Typography>
					Наиграно часов: {cmiData?.totalPlaytime}
				</Typography>
			</div>
		</BlockWrapper>
	)
}
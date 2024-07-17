"use client"

import { Typography } from "@repo/ui/src/components/typography.tsx";
import { CornerDownRight } from "lucide-react";
import { StatsRequest } from "../../../types/stats-types.ts";
import { landsStatsQuery } from "../queries/lands-stats-query.ts";
import { LandsStatsSkeleton } from "./lands-stats-skeleton.tsx";
import { Avatar } from "../../../../../../user/components/avatar/components/avatar.tsx";
import { BlockWrapper } from "../../../../../../wrappers/block-wrapper.tsx";

const LandsNotFoundStats = () => {
	return (
		<BlockWrapper>
			<Typography textShadow="small" className="text-lg text-shark-50 font-semibold">
				Нет территорий.
			</Typography>
		</BlockWrapper>
	)
}

export const LandsStats = ({
	nickname, uuid
}: StatsRequest) => {
	const { data: lands, isLoading } = landsStatsQuery({
		nickname: nickname, uuid: uuid
	})
	
	if (isLoading) return <LandsStatsSkeleton/>

	if (!lands) return <LandsNotFoundStats/>;
	
	const members = lands.members;
	
	return (
		<BlockWrapper className="flex flex-col gap-y-2">
			<Typography textShadow="small" className="text-lg text-shark-50 font-semibold">
				Территории
			</Typography>
			<div className="flex flex-col gap-y-2">
				<Typography>
					#1 {lands?.name} [{lands?.type}]
				</Typography>
				<div className="flex items-start gap-1">
					<CornerDownRight size={20}/>
					<div className="flex flex-col">
						<Typography>
							Название: {lands?.name}
						</Typography>
						<Typography>
							Описание: {lands?.title}
						</Typography>
						<Typography>
							Баланс: {lands?.balance}
						</Typography>
						<div className="flex flex-col">
							<Typography>
								Участники:
							</Typography>
							<div className="flex flex-col">
								{members?.map(item => (
									<div
										className="flex items-center gap-2 px-1 rounded-md hover:bg-shark-50/10 py-0.5 cursor-pointer"
										key={item.uuid}
									>
										<Avatar
											propHeight={14}
											propWidth={14}
											nickname={item.nickname}
										/>
										<Typography>
											{item.chunks} чанков
										</Typography>
									</div>
								))}
							</div>
						</div>
						<Typography>
							Налог: {lands?.area.tax.current}
						</Typography>
						<Typography>
							Заблокированные: {lands?.area.banned}
						</Typography>
					</div>
				</div>
			</div>
		</BlockWrapper>
	)
}
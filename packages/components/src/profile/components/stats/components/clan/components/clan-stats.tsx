import { Typography } from "@repo/ui/src/components/typography.tsx";
import { StatsRequest } from "../../../types/stats-types.ts";
import { BlockWrapper } from "../../../../../../wrappers/block-wrapper.tsx";

export const ClanStats = async({
	nickname, uuid
}: StatsRequest) => {
	return (
		<BlockWrapper className="flex flex-col gap-y-2">
			<Typography textShadow="small" className="text-lg text-shark-50 font-semibold">
				Клан
			</Typography>
			<div className="flex flex-col gap-y-2">
				<Typography>
					Название: ...
				</Typography>
			</div>
		</BlockWrapper>
	)
}
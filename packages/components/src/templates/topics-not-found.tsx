import { BlockWrapper } from "../wrappers/block-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

export const ProfileTopicsNotFound = () => {
	return (
		<BlockWrapper backgroundColor="shark_white">
			<Typography textShadow="small" className="text-lg text-shark-50 font-semibold">
				Тредов нет.
			</Typography>
		</BlockWrapper>
	)
}
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { USER } from "@repo/types/entities/entities-type.ts";

export const UserRealName = ({
	real_name, with_annotation = true
}: Pick<USER, "real_name"> & {
	with_annotation?: boolean
}) => {
	return (
		<Typography className="text-shark-300 font-[Minecraft]" textSize="medium">
			{with_annotation && 'aka'} ({real_name})
		</Typography>
	)
}
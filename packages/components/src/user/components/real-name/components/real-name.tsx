import { Typography } from "@repo/ui/src/components/typography.tsx";
import { USER } from "@repo/types/entities/entities-type.ts";

export const UserRealName = ({
	real_name
}: Pick<USER, "real_name">) => {
	return (
		<Typography className="text-shark-300 font-[Minecraft]" textSize="medium">
			aka ({real_name})
		</Typography>
	)
}
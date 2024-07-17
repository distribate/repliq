// @ts-ignore
import Elci from "@repo/assets/gifs/elci-minecraft.gif"
import { ImageWrapper } from "../wrappers/image-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

interface ContentNotFoundProps {
	title: string
}

export const ContentNotFound = ({
	title
}: ContentNotFoundProps) => {
	return (
		<div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
			<div className="flex flex-col items-center gap-y-4">
				<ImageWrapper
					propSrc={Elci.src}
					propAlt="Content not found."
					className="-ml-7"
					width={156}
					height={156}
				/>
				<Typography className="text-xl font-bold text-shark-50">
					{title}
				</Typography>
			</div>
		</div>
	)
}
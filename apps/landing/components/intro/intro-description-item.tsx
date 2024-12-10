import { ProjectDescriptionType } from "#/shared/data/intro/project-description";
import { Typography } from "#/ui/typography";

type IntroDescriptionItemProps = Omit<ProjectDescriptionType, "descColor"> & {
	opacity: number
}

export const IntroDescriptionItem = ({
	title, desc, opacity
}: IntroDescriptionItemProps) => {
	return (
		<div
			className="fader__slide max-w-3xl cursor-pointer absolute"
			style={{ opacity: opacity }}
		>
			<div
				className="flex flex-col w-full lg:max-w-3xl justify-start h-[160px] md:h-[180px] lg:h-[260px] rounded-xl py-4 lg:py-6">
				<Typography className="text-project-color-pink mb-4 text-5xl lg:text-6xl">
					{title}
				</Typography>
				<Typography shadow="xl" className="text-white text-lg lg:text-3xl">
					{desc}
				</Typography>
			</div>
		</div>
	)
}
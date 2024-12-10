import { GAMEPLAY, GameplayItemType } from "#/shared/data/gameplay/gameplay-list";
import { Overlay } from "#/ui/overlay";
import { Typography } from "#/ui/typography";

export const GameplayItem = ({
	name, image, description, id
}: GameplayItemType & {
	id: number
}) => {
	return (
		<div
			className={`flex flex-col items-center justify-end w-full min-h-screen lg:w-1/3 relative bg-top bg-cover
			 lg:bg-center border-0 border-discord-server-color ${GAMEPLAY.length - 2 === id && 'lg:border-l-2 lg:border-r-2'}`}
			style={{ backgroundImage: `url(${image})` }}
		>
			<Overlay/>
			<div
				className="flex flex-col items-center justify-center gap-y-2 py-16 px-6 relative bg-black bg-opacity-60 h-[360px]">
				<h1 className="text-2xl md:text-3xl 2xl:text-5xl text-red text-center">
					{name}
				</h1>
				<Typography position="center" className="text-xl md:text-2xl 2xl:text-3xl">
					{description}
				</Typography>
			</div>
			<div className="borders_up xl:hidden"/>
			<div className="borders_down xl:hidden"/>
		</div>
	)
}
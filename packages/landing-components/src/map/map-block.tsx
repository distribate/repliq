"use client"

import { Typography } from "@repo/landing-ui/src/typography";
import { useRouter } from "next/navigation";
import Image from 'next/image';

type MapBlockType = {
	link: string,
	name: string,
	image: string
}

export const MapBlock = ({
	image, name, link
}: MapBlockType) => {
	const { push } = useRouter();

	return (
		<div
			onClick={() => push(`${link}`)}
			className="flex flex-col group cursor-pointer items-center"
		>
			<Image
				src={image}
				width={420}
				height={420}
				title={name}
				alt=""
				className="w-[80%] h-[80%] lg:w-[420px] lg:h-[420px] group-hover:scale-105 group-hover:duration-300 duration-300"
			/>
			<div
				className="hidden lg:flex flex-col group-hover:opacity-100 group-hover:duration-300 w-[90%] duration-300 opacity-0 bg-black/60 rounded-xl p-2 relative -top-24">
				<h1 className="text-center text-xl sm:text-2xl text-bisquite-server-color text-shadow-xl">
					{name}
				</h1>
				<Typography className="text-white text-center sm:text-xl text-md">
					(RP, RPG, survival, quests)
				</Typography>
			</div>
			<div className="lg:hidden flex flex-col relative top-4">
				<Typography
					position="center"
					shadow="xl"
					className="text-center text-xl sm:text-2xl text-bisquite-server-color"
				>
					{name}
				</Typography>
				<Typography className="text-white text-center text-md sm:text-xl">
					(RP, RPG, survival, quests)
				</Typography>
			</div>
		</div>
	)
}
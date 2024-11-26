"use client"

import Image from "next/image";
import { useRouter } from "next/navigation"
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp"

export const HistoryBackButton = () => {
	const { back } = useRouter()
	
	return (
		<div
			onClick={back}
			className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]"
		>
			<Image
				src={Spyglass}
				width={48}
				height={48}
				alt="Compass"
				loading="lazy"
				className="max-w-[26px] max-h-[26px]"
			/>
			<p className="text-md font-semibold text-shark-200">
				вернуться
			</p>
		</div>
	)
}
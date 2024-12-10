"use client"

import { Typography } from "#/ui/typography";
import { Button } from "#/ui/button";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import { toast } from "sonner"
import { PROJECT_DESCRIPTION } from "#/shared/data/intro/project-description";
import Image from "next/image";
import { IntroDescriptionItem } from "#/components/intro/intro-description-item";
import { HowToConnectOnServer } from "#/components/intro/how-to-connect-on-server";

export const animation = {
	duration: 72000, easing: (t: number) => t
}

const MAIN_IP = process.env.MINECRAFT_SERVER_FASBERRY_IP

export const IntroMain = () => {
	const [ opacities, setOpacities ] = useState<number[]>([]);
	
	const actionCopyboard = async() => {
		await navigator.clipboard.writeText(MAIN_IP || "play.fasberry.ru");
		
		toast.info( "IP успешно скопирован!", {
			icon: <Image width={32} height={32} alt="IP copied!" loading="lazy" src="/images/minecraft/icons/book_big.webp"/>
		})
	}
	
	const [ sliderRef_commuinity ] = useKeenSlider<HTMLDivElement>({
		slides: PROJECT_DESCRIPTION.length,
		loop: true,
		detailsChanged(s) {
			const new_opacities = s.track.details.slides
			.map((slide) => slide.portion)
			
			setOpacities(new_opacities)
		},
	})
	
	return (
		<div
			ref={sliderRef_commuinity}
			className="select-none fader flex items-center relative -top-24 md:-top-4 z-20 w-full"
		>
			{PROJECT_DESCRIPTION.map((item, idx) =>
				<IntroDescriptionItem key={item.title} opacity={opacities[idx]} {...item}/>)
			}
			<div className="flex-col lg:flex-row items-start relative top-24 w-fit md:top-36 gap-4 hidden md:flex">
				<HowToConnectOnServer/>
			</div>
			<div
				className="flex flex-col relative top-52 sm:top-44 w-full items-center md:hidden"
			>
				<Button
					onClick={() => actionCopyboard()}
					className="w-full h-[54px] lg:h-[64px] group hover:bg-[#088d47]/80 hover:duration-300
					duration-100 ease-in-out bg-[#05b458]/80 backdrop-filter backdrop-blur-lg"
				>
					<Typography shadow="xl" className="font-bold !text-white text-xl">
						<span className="inline-block duration-150 group-hover:duration-150 group-hover:rotate-180">⏵</span>
						&nbsp;Начать играть&nbsp;
						<span className="inline-block duration-150 group-hover:duration-150 group-hover:-rotate-180">⏴</span>
					</Typography>
				</Button>
			</div>
		</div>
	)
}
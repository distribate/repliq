"use client"

import { Typography } from "@repo/landing-ui/src/typography";
import { Button } from "@repo/landing-ui/src/button";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { PROJECT_DESCRIPTION } from "@repo/shared/wiki/data/intro/project-description";
import { HowToConnectOnServer } from "../intro/how-to-connect-on-server";
import { serverIpQuery } from "@repo/lib/queries/server-ip-query";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@repo/landing-ui/src/carousel";

export const animation = {
	duration: 72000, easing: (t: number) => t
}

export const IntroMain = () => {
	const { data: ip } = serverIpQuery()
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (api && selectedIndex !== null) api.scrollTo(selectedIndex, true);
	}, [api, selectedIndex]);

	const actionCopyboard = async () => {
		if (!ip) return;

		await navigator.clipboard.writeText(ip);

		return toast.success("IP успешно скопирован!", {
			icon: (
				<img
					width={32}
					height={32}
					alt=""
					loading="lazy"
					src="/images/minecraft/icons/book_big.webp"
				/>
			)
		})
	}

	return (
		<>
			<div className="flex flex-col select-none -top-24 relative items-start md:-top-4 z-20 w-full lg:max-w-1/3">
				<Carousel
					setApi={setApi}
					opts={{
						align: "start",
						dragFree: false,
						loop: true,
						slidesToScroll: 1
					}}
					className="w-full lg:w-2/3 self-start"
				>
					<CarouselContent>
						{PROJECT_DESCRIPTION.map(({ title, desc }, i) => (
							<CarouselItem key={i} className="w-full lg:w-1/3">
								<div
									className="flex flex-col w-full lg:max-w-full justify-start rounded-xl py-4 lg:py-6">
									<Typography className="text-project-color-pink mb-4 text-5xl lg:text-6xl">
										{title}
									</Typography>
									<Typography shadow="xl" className="text-white text-lg lg:text-3xl">
										{desc}
									</Typography>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
				<div className="flex-col lg:flex-row items-start relative w-fit gap-4 hidden lg:flex">
					<HowToConnectOnServer />
					<Button
						className="w-full h-[54px] aspect-square bg-black/60 backdrop-blur-md"
						onClick={() => setSelectedIndex((selectedIndex + 1) % PROJECT_DESCRIPTION.length)}
					>
						<Typography className="text-[18px] font-semibold">{`>`}</Typography>
					</Button>
				</div>
				<div
					className="flex flex-col relative w-full items-center lg:hidden"
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
		</>
	)
}
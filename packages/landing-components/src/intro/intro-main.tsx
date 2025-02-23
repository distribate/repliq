"use client"

import { Typography } from "@repo/landing-ui/src/typography";
import { Button } from "@repo/landing-ui/src/button";
import { useEffect, useState } from "react";
import { PROJECT_DESCRIPTION } from "@repo/shared/wiki/data/intro/project-description";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@repo/landing-ui/src/carousel";
import Link from "next/link";

export const animation = {
	duration: 72000, easing: (t: number) => t
}

export const IntroMain = () => {
	const [sel, setSel] = useState<number>(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (api && sel !== null) api.scrollTo(sel, true);
	}, [api, sel]);

	return (
		<div className="flex flex-col select-none relative items-start w-full lg:w-2/3">
			<Carousel
				className="w-full self-start"
				setApi={setApi}
				opts={{ align: "start", dragFree: false, loop: true, slidesToScroll: 1 }}
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
			<div className="flex-col lg:flex-row h-[54px] items-start relative w-fit gap-4 hidden lg:flex">
				<Link href="/start">
					<Button
						variant="positive"
						className="w-full rounded-xl group hover:duration-300 duration-100 ease-in-out backdrop-blur-lg"
					>
						<Typography className="!text-white text-2xl text-shadow-xl">
							<span className="inline-block duration-150 group-hover:duration-300 group-hover:translate-x-2">
								⏵
							</span>
							&nbsp;Начать играть&nbsp;
							<span className="inline-block duration-150 group-hover:duration-300 group-hover:-translate-x-2">
								⏴
							</span>
						</Typography>
					</Button>
				</Link>
				<Button
					className="w-full h-full group hover:border-white/80 rounded-xl
					 	border-2 border-white/60 aspect-square bg-black/60 backdrop-blur-md"
					onClick={() => setSel((sel + 1) % PROJECT_DESCRIPTION.length)}
				>
					<Typography className="text-[18px] group-hover:text-white/80 text-white/60 font-semibold">
						{`>`}
					</Typography>
				</Button>
			</div>
			<div className="flex flex-col relative w-full items-center lg:hidden">
				<Link href="/start" className="w-full">
					<Button
						variant="positive"
						className="w-full h-[54px] lg:h-[64px] rounded-xl group hover:duration-300	duration-100 ease-in-out"
					>
						<Typography shadow="xl" className="font-bold text-white text-xl">
							<span className="inline-block duration-150 group-hover:duration-150 group-hover:rotate-180">
								⏵
							</span>
							&nbsp;Начать играть&nbsp;
							<span className="inline-block duration-150 group-hover:duration-150 group-hover:-rotate-180">
								⏴
							</span>
						</Typography>
					</Button>
				</Link>
			</div>
		</div>
	)
}
"use client"

import { useControlCoverImage } from "../hooks/use-control-cover-image.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ImageUp } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HTMLAttributes } from "react";
import { DialogWrapper } from "../../../../../../wrappers/dialog-wrapper.tsx";
import { Image, CloudUpload } from 'lucide-react';
import AdventureInBlossom from "@repo/assets/images/adventure-in-blossom.jpg"
import SandCamel from "@repo/assets/images/sand-camel.jpg"
import SnowMountains from "@repo/assets/images/snow-mountain.jpg"
import Warden from "@repo/assets/images/render-warden-hide.jpg"
import Rain from "@repo/assets/images/rain_weather.jpg"
import ShipOnRiver from "@repo/assets/images/ship_in_river.png"
import SandHunter from "@repo/assets/images/sand_hunter.jpg"
import { ImageWrapper } from "../../../../../../wrappers/image-wrapper.tsx";

const DEFAULT_IMAGES = [
	{
		title: "Adventure in Blossom",
		src: AdventureInBlossom.src,
		value: "adventure-in-blossom.jpg"
	},
	{
		title: "Camel in sand",
		src: SandCamel.src,
		value: "sand-camel.jpg"
	},
	{
		title: "Snow mountains",
		src: SnowMountains.src,
		value: "snow-mountain.jpg"
	},
	{
		title: "Warden",
		src: Warden.src,
		value: "render-warden-hide.jpg"
	},
	{
		title: "Rain",
		src: Rain.src,
		value: "rain_weather.jpg"
	},
	{
		title: "Shin on River",
		src: ShipOnRiver.src,
		value: "ship_in_river.png"
	},
	{
		title: "Sand Hunter",
		src: SandHunter.src,
		value: "sand_hunter.jpg"
	},
]

interface LibraryBackgroundItemsProps
	extends HTMLAttributes<HTMLDivElement> {}

const LibraryBackgroundItem = ({
	children, ...props
}: LibraryBackgroundItemsProps) => {
	return (
		<div className="flex flex-col rounded-md overflow-hidden border-[1px] border-white/10 relative hover:bg-white/10
		 cursor-pointer group transition-all duration-150 w-full" {...props}>
			{children}
		</div>
	)
}

type CoverImageInput = {
	type: "origin" | "library",
	file: File | null,
	fileName?: string
}

export const UploadBackgroundImageButton = () => {
	const { uploadBackgroundImageMutation } = useControlCoverImage();
	
	const handleCoverImageInput = ({
		fileName, file, type
	}: CoverImageInput) => {
		if (!type) return;
		
		switch(type) {
			case "library":
				if (!fileName) return;
				
				return uploadBackgroundImageMutation.mutate({
					file: null,
					customFilename: 'default/' + fileName
				})
			case "origin":
				if (!file) return;
				
				return uploadBackgroundImageMutation.mutateAsync({
					file: file
				})
		}
	}
	
	return (
		<DialogWrapper
			name="profile-background-update"
			properties={{ dialogContentClassName: "max-w-3xl" }}
			asChild={true}
			trigger={
				<Button className="gap-2 relative items-center group justify-start w-full">
					<ImageUp size={16} className="text-shark-300 group-hover:text-pink-500"/>
					<Typography>Обновить фон</Typography>
				</Button>
			}
		>
			<div className="flex flex-col items-center gap-y-4 w-full">
				<Typography textSize="big" textColor="shark_white">Доступные действия</Typography>
				<div className="flex items-center justify-center *:w-full w-full">
					<DialogWrapper
						name="profile-background-upload-variants"
						properties={{ dialogContentClassName: "max-w-6xl" }}
						trigger={
							<div className="flex w-full gap-x-2 p-6 group rounded-l-md items-center group hover:bg-white/10">
								<Image size={24} className="text-shark-300 group-hover:text-pink-500"/>
								<Typography textSize="medium" textColor="shark_white">Выбрать из библиотеки</Typography>
							</div>
						}
					>
						<div className="flex flex-col items-center gap-y-4 w-full">
							<Typography textSize="big" textColor="shark_white">Библиотека</Typography>
							<div className="grid grid-cols-3 gap-2 grid-rows-1 w-full">
								{DEFAULT_IMAGES.map((item, i) => (
									<LibraryBackgroundItem
										key={i}
										onClick={() => handleCoverImageInput({
											type: "library", fileName: item.value, file: null
										})}
									>
										<ImageWrapper propSrc={item.src}
											propAlt={item.title} height={900}
											width={1200} loading="lazy" className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
										/>
										<Typography textShadow="small" className="absolute bottom-4 left-4 text-md font-medium text-shark-50">
											{item.title}
										</Typography>
									</LibraryBackgroundItem>
								))}
							</div>
						</div>
					</DialogWrapper>
					<div className="flex relative gap-x-2 p-6 rounded-r-md items-center group hover:bg-white/10">
						<CloudUpload size={24} className="text-shark-300 group-hover:text-pink-500"/>
						<Typography textSize="medium" textColor="shark_white">Загрузить своё</Typography>
						<input type="file" id="file"
							className="absolute right-0 top-0 left-0 bottom-0 opacity-0 w-full"
							onChange={(e) => handleCoverImageInput({
								type: "origin", file: e.target?.files ? e.target.files[0] : null
							})}
						/>
					</div>
				</div>
			</div>
		</DialogWrapper>
	)
}
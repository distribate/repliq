import { DialogWrapper } from "#/components/wrappers/dialog-wrapper";

type CommunityGalleryItemProps = {
	image: string
}

export const CommunityGalleryItem = ({
	image
}: CommunityGalleryItemProps) => {
	return (
		<DialogWrapper
			classNames={{ content: "w-4xl p-0" }}
			title="Галлеря"
			trigger={
				<div
					className="flex flex-col rounded-[8px] overflow-hidden cursor-pointer hover:duration-300 hover:brightness-50 duration-300"
				>
					<img
						src={image}
						width={1280}
						alt=""
						loading="lazy"
						height={720}
						className="w-full sm:h-[96px] md:h-[120px] lg:w-[250px] lg:h-[136px] object-cover"
					/>
				</div>
			}
			content={
				<img
					src={image}
					alt=""
					loading="lazy"
					className="w-full object-cover h-full rounded-[8px]"
					width={1920}
					height={1080}
				/>
			}
		/>
	)
}
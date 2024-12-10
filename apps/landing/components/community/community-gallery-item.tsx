import { DialogWrapper } from "#/components/wrappers/dialog-wrapper";
import { ImageWrapper } from "#/ui/image-wrapper";

type CommunityGalleryItemProps = {
	image: string
}

export const CommunityGalleryItem = ({
	image
}: CommunityGalleryItemProps) => {
	return (
		<DialogWrapper
			classNames={{ content: "w-4xl p-0" }}
			title="Gallery"
			trigger={
				<div
					className="flex flex-col rounded-[12px] overflow-hidden cursor-pointer hover:duration-300 hover:brightness-50 duration-300"
				>
					<ImageWrapper
						src={image}
						title="Community"
						width={1280}
						height={720}
						className="w-full sm:h-[60px] md:h-[120px] lg:w-[250px] lg:h-[136px] object-cover"
					/>
				</div>
			}
			content={
				<ImageWrapper
					src={image}
					title="Community"
					className="w-full object-cover h-full rounded-[8px]"
					width={1920}
					height={1080}
				/>
			}
		/>
	)
}
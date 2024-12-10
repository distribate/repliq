import Image from "next/image";
import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

const imageWrapperVariants = cva("overflow-hidden border-none outline-none", {
	variants: {
		filters: {
			blur: "hover:backdrop-filter-blue hover:backdrop-md"
		}
	}
})

interface IImageWrapper extends HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof imageWrapperVariants> {
	src: string,
	title: string,
	width?: number,
	height?: number
}

export const ImageWrapper = ({
	src,
	filters,
	className,
	width,
	height,
	title,
	...props
}: IImageWrapper) => {
	return (
		<div className={imageWrapperVariants(({ filters }))} {...props}>
			<Image
				src={src}
				alt={title}
				width={width}
				height={height}
				title={title}
				loading="lazy"
			/>
		</div>
	)
}
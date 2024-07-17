import Image from "next/image";
import { forwardRef, Suspense } from "react";
import { cn } from "@repo/lib/utils/ui/cn.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

type ImageWrapperProps = {
	propSrc: string,
	propAlt: string,
	propTitle?: string,
	width?: number,
	height?: number,
	className?: string,
	priority?: boolean,
	loading?: "eager" | "lazy"
}

const ImageWrapper = forwardRef<
	HTMLDivElement, ImageWrapperProps
>((
	{
		propSrc,
		loading,
		propTitle,
		className,
		width,
		propAlt,
		priority = false,
		height,
		...rest
	},
	ref
) => {
	return (
		<div
			className={cn("overflow-hidden flex ", className)}
			ref={ref}
			{...rest}
		>
			<Suspense fallback={
				<Skeleton className={`w-fit h-fit rounded-md`}/>
			}>
				<Image
					src={propSrc}
					priority={priority}
					width={width}
					placeholder="empty"
					height={height}
					alt={propAlt}
					loading={loading}
					draggable={false}
				/>
			</Suspense>
		</div>
	)
})

export { ImageWrapper }
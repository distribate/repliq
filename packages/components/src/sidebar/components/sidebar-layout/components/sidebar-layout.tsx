import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

export const sidebarLayoutVariants = cva(
	`flex flex-col justify-between h-full transition-all duration-100
	 rounded-lg ease-in-out border-[1px] border-white/10 overflow-hidden
	 py-6 bg-shark-950 outline-none`,
	{
		variants: {
			variant: {
				default: "",
				compact: "px-1 w-[60px] max-w-[60px]",
				full: "min-w-[300px] w-[300px] max-w-[300px] px-4"
			},
			padding: {
				small: "px-1",
				medium: "px-3"
			}
		},
	}
)

interface SidebarLayoutProps
	extends HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof sidebarLayoutVariants> {}

export const SidebarLayout = forwardRef<
	HTMLDivElement, SidebarLayoutProps
>(({
	variant,
	className,
	padding,
	...props
}, ref) => {
	return (
		<div
			ref={ref}
			className={sidebarLayoutVariants(({ variant, padding, className }))}
			{...props}
		/>
	)
})
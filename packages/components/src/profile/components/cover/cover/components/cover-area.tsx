import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, memo } from "react";

const coverAreaVariants = cva(
	"flex w-full bg-center rounded-xl mt-[4px] overflow-hidden bg-cover bg-no-repeat items-center justify-between px-12 py-6", {
		variants: {
			variant: {
				full: "relative z-[3] h-[414px]",
				compact: "sticky top-0 z-[5] h-[112px]"
			},
			backgroundColor: {
				transparent: "bg-transparent",
				gray: "bg-shark-800"
			}
		}
	}
)

interface CoverArea {
	backgroundImage?: string
}

interface CoverAreaProps extends HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof coverAreaVariants>, CoverArea {}

export const CoverArea = ({
	className, variant, backgroundColor, backgroundImage, ...props
}: CoverAreaProps) => {
	return <div className={coverAreaVariants(({ variant, className, backgroundColor }))} {...props}/>
}
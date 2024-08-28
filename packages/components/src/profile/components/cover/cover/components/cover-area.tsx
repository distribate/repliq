import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, memo } from "react";

const coverAreaVariants = cva(
	"flex w-full bg-center rounded-xl mt-[4px] overflow-hidden bg-cover bg-no-repeat items-center justify-between px-12 py-6", {
		variants: {
			variant: {
				full: "relative z-[3] min-h-[414px] max-h-[414px]",
				compact: "sticky top-0 z-[5] min-h-[112px] max-h-[112px]"
			},
			backgroundColor: {
				transparent: "bg-transparent",
				gray: "bg-shark-800"
			},
			border: {
				default: "border-none",
				arkhont: "border-arkhont-background border-[2px]",
				authentic: "border-authentic-background border-[2px]",
				loyal: "border-loyal-background border-[2px]",
				moder: "border-moder-background border-[2px]",
				helper: "border-helper-background border-[2px]",
				dev: "border-dev-background border-[2px]"
			}
		},
		defaultVariants: {
			border: "default"
		}
	}
)

interface CoverArea {
	backgroundImage?: string
}

interface CoverAreaProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof coverAreaVariants>, CoverArea {
}

export const CoverArea = ({
	className, variant, backgroundColor, backgroundImage, border, ...props
}: CoverAreaProps) => {
	return <div
		className={coverAreaVariants(({ variant, border, className, backgroundColor }))}
		{...props
	}/>
}
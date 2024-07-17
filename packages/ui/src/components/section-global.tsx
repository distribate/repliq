import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

const sectionGlobalVariants = cva("flex gap-y-4 w-full py-4", {
	variants: {
		variant: {
			section: "flex-col rounded-md border-[1px] px-4 border-white/10 bg-shark-950",
			subsection: "flex-col bg-black/60 px-2"
		}
	}
})

interface SectionGlobalProps extends HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof sectionGlobalVariants> {
}

const SectionGlobal = forwardRef<
	HTMLDivElement, SectionGlobalProps
>((
	{
		variant, className, ...props
	}, ref
) => {
	return <div className={sectionGlobalVariants(({ variant, className }))} ref={ref}{...props}/>
})

export { SectionGlobal };
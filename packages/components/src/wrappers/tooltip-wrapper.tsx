import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip.tsx";
import { ReactNode } from "react";
import { cn } from "@repo/lib/utils/ui/cn.ts";

interface TooltipWrapperProps {
	trigger: ReactNode,
	content: ReactNode,
	properties?: {
		asChild?: boolean,
		contentAlign?: "end" | "start",
		contentAlignOffset?: number,
		sideAlign?: "top" | "right" | "bottom" | "left",
		triggerClassname?: string
	}
}

export const TooltipWrapper = ({
	trigger,
	content,
	properties = {
		asChild: false,
		contentAlign: "start",
		sideAlign: "top",
		contentAlignOffset: 0,
		triggerClassname: ""
	}
}: TooltipWrapperProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger
					asChild={properties.asChild}
					className={cn(" ", properties?.triggerClassname)}
				>
					{trigger}
				</TooltipTrigger>
				<TooltipContent
					side={properties.sideAlign}
					align={properties.contentAlign}
					alignOffset={properties.contentAlignOffset}
				>
					{content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
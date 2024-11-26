import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { ReactNode } from "react";

export interface DropdownWrapperProps {
	trigger: ReactNode,
	content: ReactNode,
	properties?: Partial<{
		triggerAsChild: boolean,
		contentAsChild: boolean,
		contentAlign: "end" | "start",
		contentAlignOffset: number,
		sideAlign: "top" | "right" | "bottom" | "left",
		contentClassname: string,
		isModal: boolean,
		contentRef: any | null,
		onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
		onCloseAutoFocus: boolean
	}>
}

export const DropdownWrapper = ({
	content,
	trigger,
	properties = {
		triggerAsChild: false,
		contentAsChild: false,
		contentAlign: "start",
		sideAlign: "top",
		onCloseAutoFocus: false,
		contentAlignOffset: 0,
		contentRef: null,
		isModal: false
	}
}: DropdownWrapperProps) => {
	return (
		<DropdownMenu modal={properties?.isModal}>
			<DropdownMenuTrigger
				asChild={properties?.triggerAsChild}
				className="w-full focus-visible:outline-none"
				onClick={properties?.onClick}
			>
				{trigger}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				ref={properties?.contentRef}
				asChild={properties?.contentAsChild}
				className={properties.contentClassname}
				align={properties.contentAlign}
				side={properties.sideAlign}
				alignOffset={properties.contentAlignOffset}
				onCloseAutoFocus={(e) => {
					if (properties?.onCloseAutoFocus) return e.preventDefault()
				}}
			>
				{content}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
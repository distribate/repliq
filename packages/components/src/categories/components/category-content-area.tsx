import { ReactNode } from "react";

type ContentAreaProps = {
	children: ReactNode
}

export const CategoryContentArea = ({
	children
}: ContentAreaProps) => {
	return (
		<div className="flex flex-col gap-y-2 w-full h-full">
			{children}
		</div>
	)
}
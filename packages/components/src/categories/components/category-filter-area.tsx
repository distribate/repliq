import { ReactNode } from "react";

export const CategoryFilterArea = ({
	children
}: {
	children: ReactNode
}) => {
	return (
		<div className="flex w-full items-center px-2">
			{children}
		</div>
	)
}
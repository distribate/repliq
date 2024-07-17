import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

export const LandsStatsSkeleton = () => {
	return (
		<Skeleton className="flex flex-col h-[400px] gap-y-2 rounded-md px-4 py-2"/>
	)
}
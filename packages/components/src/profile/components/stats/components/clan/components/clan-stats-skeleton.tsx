import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ClanStatsSkeleton = () => {
	return (
		<Skeleton className="flex flex-col gap-y-2 bg-shark-950 rounded-md px-4 py-2">
			<Skeleton className="h-6 w-[40px]"/>
			<div className="flex flex-col gap-y-2">
				<div className="flex flex-row items-center gap-1">
					<Skeleton className="h-6 w-[90px]"/>
					<Skeleton className="h-6 w-[66px]"/>
				</div>
			</div>
		</Skeleton>
	)
}
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ThreadsSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-2 w-full py-6">
			<Skeleton className="h-[60px] w-full"/>
			<Skeleton className="h-[60px] w-full"/>
			<Skeleton className="h-[60px] w-full"/>
		</div>
	)
}
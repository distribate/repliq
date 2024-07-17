import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ThreadCommentsSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-2 w-full">
			<Skeleton className="h-[80px] w-full rounded-md"/>
			<Skeleton className="h-[80px] w-full rounded-md"/>
			<Skeleton className="h-[80px] w-full rounded-md"/>
		</div>
	)
}
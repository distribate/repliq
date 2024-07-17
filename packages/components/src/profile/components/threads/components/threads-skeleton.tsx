import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ThreadsSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-2 w-full py-6">
			<Skeleton className="rounded-md h-[60px] w-full"/>
			<Skeleton className="rounded-md h-[60px] w-full"/>
			<Skeleton className="rounded-md h-[60px] w-full"/>
		</div>
	)
}
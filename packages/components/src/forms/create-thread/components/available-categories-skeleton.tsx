import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const AvailableCategoriesSkeleton = () => {
	return (
		<>
			<Skeleton className="h-6 rounded-md px-2 py-1 "/>
			<Skeleton className="h-6 rounded-md px-2 py-1 "/>
			<Skeleton className="h-6 rounded-md px-2 py-1 "/>
			<Skeleton className="h-6 rounded-md px-2 py-1 "/>
		</>
	)
}
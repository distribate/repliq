import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const ThreadCommentsSkeleton = () => {
	return (
		<div className="flex flex-col items-start gap-y-2 w-full">
			{Array.from({ length: 3 }).map((_, i) => (
				<Skeleton key={i} className="h-[80px] w-full"/>
			))}
		</div>
	)
}
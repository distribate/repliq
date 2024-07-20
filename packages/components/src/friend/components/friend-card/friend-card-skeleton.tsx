import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const FriendCardSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-4 w-full p-4 rounded-md0">
			<div className="flex items-center gap-2">
				<Skeleton className="w-[46px] h-[46px] rounded-md"/>
				<div className="flex flex-col">
					<Skeleton className="w-[89px] h-[46px] rounded-md "/>
					<Skeleton className="w-[68px] h-[46px] rounded-md "/>
				</div>
			</div>
			<div className="flex flex-col">
				<Skeleton className="w-[126px] h-[46px] rounded-md"/>
				<Skeleton className="w-[45px] h-[46px] rounded-md"/>
			</div>
		</div>
	)
}
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const FriendProfileCardSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-4 w-full p-4 rounded-lg">
			<div className="flex items-center gap-2">
				<Skeleton className="w-[46px] h-[46px]"/>
				<div className="flex flex-col">
					<Skeleton className="w-[89px] h-[46px]"/>
					<Skeleton className="w-[68px] h-[46px]"/>
				</div>
			</div>
			<div className="flex flex-col">
				<Skeleton className="w-[126px] h-[46px]"/>
				<Skeleton className="w-[45px] h-[46px]"/>
			</div>
		</div>
	)
}
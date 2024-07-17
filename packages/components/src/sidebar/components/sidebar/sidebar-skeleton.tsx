import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";

export const SidebarSkeleton = () => {
	return (
		<div className={`flex flex-col justify-between
			border-[1px] px-3 rounded-md overflow-hidden min-h-screen h-full py-6
			bg-shark-950 border-white/10 outline-none max-w-[300px]`}
		>
			<div className="flex flex-col gap-y-4 items-center justify-center">
				<div className="flex flex-row items-center gap-4">
					<Skeleton className="w-[42px] h-[42px] rounded-md"/>
					<Skeleton className="h-10 w-48 rounded-md"/>
				</div>
				<Separator/>
				<div className="flex items-center gap-2 justify-between w-full">
					<Skeleton className="flex h-10 items-center gap-1 grow rounded-md"/>
					<Skeleton className="flex h-10 w-10 rounded-md"/>
				</div>
				<Separator/>
				<Skeleton className="flex gap-x-3 h-[50px] items-center rounded-md w-full"/>
				<Separator/>
				<Skeleton className="flex h-10 items-center rounded-md w-full"/>
				<Separator/>
				<Skeleton className="flex h-[230px] items-center rounded-md w-full"/>
				<Separator/>
				<div className="flex flex-col gap-y-2 w-full">
					<Skeleton className="flex h-10 items-center rounded-md w-full"/>
					<Skeleton className="flex h-10 items-center rounded-md w-full"/>
					<Skeleton className="flex h-10 items-center rounded-md w-full"/>
					<Skeleton className="flex h-10 items-center rounded-md w-full"/>
				</div>
			</div>
		</div>
	)
}
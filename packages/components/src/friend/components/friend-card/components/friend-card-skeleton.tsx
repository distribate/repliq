import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const FriendCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 w-full min-h-[112px] bg-shark-950 border border-shark-800 rounded-lg p-4">
      <Skeleton className="rounded-lg w-[112px] h-[112px]" />
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <div className="flex items-center gap-1">
            <Skeleton className="h-6 w-64"/>
            <Skeleton className="h-6 w-48"/>
          </div>
          <Skeleton className="h-6 w-24"/>
        </div>
        <div className="flex items-center w-fit">
          <Skeleton className="h-6 w-48"/>
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Skeleton className="h-6 w-48"/>
          <Skeleton className="h-6 w-48"/>
        </div>
      </div>
    </div>
  )
}
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const SearchItemSkeleton = () => {
  return (
    <div className="flex items-center px-2 py-2 gap-2">
      <Skeleton className="rounded-none w-4 h-4"/>
      <div className="flex items-center gap-1">
        <Skeleton className="h-5 w-24"/>
        <Skeleton className="h-5 w-16 "/>
      </div>
    </div>
  )
}
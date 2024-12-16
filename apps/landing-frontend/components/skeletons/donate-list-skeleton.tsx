import { Skeleton } from '#/ui/skeleton.tsx';

export const DonateListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <Skeleton className="w-full h-[600px]" />
      <Skeleton className="w-full h-[600px]" />
      <Skeleton className="w-full h-[600px]" />
    </div>
  )
}
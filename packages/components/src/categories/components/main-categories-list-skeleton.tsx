import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export const MainCategoriesListSkeleton = async() => {
  return (
    <div className="flex lg:flex-row flex-col w-full h-full">
      <div className="flex flex-col w-full pr-4 gap-y-4 min-h-[400px] h-full">
        <Skeleton className="h-[200px] w-full"/>
        <Skeleton className="h-[200px] w-full"/>
        <Skeleton className="h-[200px] w-full"/>
        <Skeleton className="h-[200px] w-full"/>
        <Skeleton className="h-[200px] w-full"/>
      </div>
      <div className="flex flex-col gap-y-4 w-1/3 h-full">
        <Skeleton className="h-[260px] w-full"/>
        <Skeleton className="h-[310px] w-full"/>
      </div>
    </div>
  )
}
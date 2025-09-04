import { Skeleton } from "@repo/ui/src/components/skeleton"

export const LatestCommentsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full rounded-lg overflow-hidden bg-primary-color">
      <Skeleton className="h-8 min-w-14 w-fit max-w-24" />
      <div className="flex flex-col w-full h-full gap-2">
        {Array.from({ length: 3 }).map((_, idx) =>
          <Skeleton key={idx} className="h-12 w-full" />
        )}
      </div>
    </div>
  )
}

export const LatestNewsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full rounded-lg overflow-hidden bg-primary-color">
      <Skeleton className="h-8 min-w-16 w-fit max-w-36" />
      <div className="flex flex-col w-full h-full gap-2">
        {Array.from({ length: 3 }).map((_, idx) =>
          <Skeleton key={idx} className="max-h-[200px] h-fit min-h-[128px] w-full" />
        )}
      </div>
    </div>
  )
}

export const LatestRegUsersSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-4 rounded-lg overflow-hidden bg-primary-color">
      <Skeleton className="h-8 min-w-24 w-fit max-w-36" />
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
        {Array.from({ length: 6 }).map((_, idx) =>
          <Skeleton key={idx} className="aspect-square size-12" />
        )}
      </div>
    </div>
  )
}

export const OnlineUsersSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-4 rounded-lg overflow-hidden bg-primary-color">
      <Skeleton className="h-8 min-w-24 w-fit max-w-36" />
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
        {Array.from({ length: 6 }).map((_, idx) =>
          <Skeleton key={idx} className="aspect-square size-12" />
        )}
      </div>
    </div>
  )
}
import { MainCategoriesSkeleton } from "#components/categories/components/categories-list/components/main-categories-list"
import { Skeleton } from "@repo/ui/src/components/skeleton"

const MainNavigationSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 *:w-full w-full">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  )
}

export const MainPageSkeleton = () => {
  return (
    <div className="flex w-full relative min-h-screen items-center py-2 justify-center overflow-hidden">
      <div className="flex flex-col gap-4 w-[calc(100%-8px)] sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] 2xl:w-[85%] h-full items-center justify-start">
        <Skeleton className="w-full h-[96px]" />
        <div id="main" className="flex gap-y-4 w-full h-full min-h-screen main-section">
          <div className="flex min-h-dvh w-full items-center justify-center">
            <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
              <div className="flex flex-col w-full xl:w-3/4 gap-2 h-full">
                <Skeleton className="w-full max-h-[400px] h-[340px]" />
                <MainNavigationSkeleton />
                <MainCategoriesSkeleton />
                <Skeleton className="w-full h-[230px]" />
              </div>
              <div className='flex flex-col w-full h-full xl:w-1/4 gap-2'>
                <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
                  <Skeleton className="h-8 min-w-14 w-fit max-w-24" />
                  <div className="flex flex-col w-full h-full gap-2">
                    {Array.from({ length: 3 }).map((_, idx) =>
                      <Skeleton key={idx} className="h-12 w-full" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
                  <Skeleton className="h-8 min-w-16 w-fit max-w-36" />
                  <div className="flex flex-col w-full h-full gap-2">
                    {Array.from({ length: 3 }).map((_, idx) =>
                      <Skeleton key={idx} className="max-h-[200px] h-fit min-h-[128px] w-full" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
                  <Skeleton className="h-8 min-w-24 w-fit max-w-36" />
                  <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
                    {Array.from({ length: 6 }).map((_, idx) =>
                      <Skeleton key={idx} className="aspect-square size-12" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
                  <Skeleton className="h-8 min-w-24 w-fit max-w-36" />
                  <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
                    {Array.from({ length: 6 }).map((_, idx) =>
                      <Skeleton key={idx} className="aspect-square size-12" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
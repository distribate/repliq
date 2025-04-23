import { ThreadReactionsSkeleton } from "#components/thread/thread-reactions/components/thread-reactions-skeleton";
import { BlockWrapper } from "#components/wrappers/components/block-wrapper";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export const ThreadMainSkeleton = () => {
  return (
    <>
      <div className="flex flex-col xl:order-first order-last w-full xl:min-w-3/4 xl:w-3/4 relative xl:max-w-3/4 items-start h-full justify-start">
        <div className="flex flex-col gap-6 rounded-lg w-full py-6 bg-primary-color">
          <div className="flex flex-col gap-1 w-full px-4">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="flex px-4 h-60 w-full">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex items-center px-4 w-full justify-start gap-1">
            <ThreadReactionsSkeleton />
            <div className="flex flex-col w-full gap-2">
              <div className="flex w-full gap-1 justify-end">
                <div className="flex items-center w-fit gap-1">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <BlockWrapper padding="without" className="mt-4">
          <Skeleton className="h-44 w-full" />
        </BlockWrapper>
      </div>
      <div className="flex flex-col gap-y-4 min-w-1/4 w-1/4 max-w-1/4 h-fit sticky top-0 overflow-hidden">
        <BlockWrapper>
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-24 w-full" />
          </div>
        </BlockWrapper>
      </div>
    </>
  )
};
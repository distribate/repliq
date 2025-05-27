import { Thread, ThreadCommentsSection } from '#components/thread/thread-main/components/thread-main'
import { lazy, Suspense } from 'react'
import { ThreadMore } from '#components/thread/thread-more/components/thread-more'
import { ThreadsRecommendations } from '#components/thread/thread-recommendations/components/thread-recommendations'

const ThreadControl = lazy(() => import("#components/thread/thread-control/components/thread-control").then(m => ({ default: m.ThreadControl })))

export function ThreadRouteComponent() {
  return (
    <div className="flex xl:flex-row flex-col gap-2 items-start h-full w-full relative">
      <div
        className="flex flex-col xl:order-first order-last w-full 
            xl:min-w-3/4 xl:w-3/4 relative xl:max-w-3/4 items-start h-full justify-start"
      >
        <Thread />
        <div className="flex w-full bg-shark-950 rounded-lg mt-4">
          <ThreadMore />
        </div>
        <ThreadCommentsSection />
      </div>
      <div
        className="flex flex-col order-first xl:order-last gap-y-4 
            lg:min-w-1/4 xl:w-1/4 w-full xl:max-w-1/4 h-fit relative xl:sticky top-0 overflow-hidden"
      >
        <Suspense>
          <ThreadControl />
        </Suspense>
        <ThreadsRecommendations />
      </div>
    </div>
  )
}
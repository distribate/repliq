import { ThreadMore } from '#components/thread/thread-more/components/thread-more'
import { ThreadsRecommendations } from '#components/thread/thread-recommendations/components/thread-recommendations'
import { ThreadCommentsSection } from '#components/thread/thread-comments/components/thread-comments'
import { useUpdate } from '@reatom/npm-react'
import { defineThread } from '#components/thread/thread-main/models/thread.model'
import { Thread } from '#components/thread/thread-main/components/thread-main'
import { useData } from 'vike-react/useData'
import { Data } from './+data'

const DefineThread = () => {
  const { data, id: target } = useData<Data>();
  useUpdate((ctx) => defineThread(ctx, data), [target])
  return null
}

export default function ThreadPage() {
  return (
    <>
      <DefineThread />
      <ThreadRouteComponent />
    </>
  )
}

function ThreadRouteComponent() {
  return (
    <div className="flex xl:flex-row flex-col gap-2 items-start h-full w-full relative">
      <div
        className="flex flex-col order-first w-full gap-2
            xl:min-w-3/4 xl:w-3/4 relative xl:max-w-3/4 items-start h-full justify-start"
      >
        <Thread />
        <div className="flex w-full bg-shark-950 rounded-lg">
          <ThreadMore />
        </div>
        <ThreadCommentsSection />
      </div>
      <div
        className="flex flex-col order-last gap-y-4 h-fit relative top-0 overflow-hidden
            lg:min-w-1/4 xl:w-1/4 w-full xl:max-w-1/4 xl:sticky"
      >
        <ThreadsRecommendations />
      </div>
    </div>
  )
}
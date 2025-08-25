import { ThreadMore } from '#components/thread/thread-more/components/thread-more'
import { ThreadsRecommendations } from '#components/thread/thread-recommendations/components/thread-recommendations'
import { ThreadCommentsSection } from '#components/thread/thread-comments/components/thread-comments'
import { useUpdate } from '@reatom/npm-react'
import { defineThread, threadAtom, threadPropertiesAtom } from '#components/thread/models/thread.model'
import { useData } from 'vike-react/useData'
import { Data } from './+data'
import { Typography } from "@repo/ui/src/components/typography"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@repo/ui/src/components/context-menu"
import { ThreadReactions } from "#components/thread/thread-reactions/components/thread-reactions"
import { ThreadSave } from "#components/thread/thread-save/components/thread-save"
import { reatomComponent } from "@reatom/npm-react"
import { isAuthenticatedAtom } from "#components/auth/models/auth.model"
import { clientOnly } from "vike-react/clientOnly"
import { ThreadContent } from "#components/thread/thread-content/components/thread-content"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { SectionSkeleton } from '#components/templates/components/section-skeleton'
import { ThreadImages } from '#components/thread/thread-images/components/thread-images'

const ThreadContextMenu = clientOnly(() =>
  import("#components/thread/thread-context-menu/thread-context-menu").then(m => m.ThreadContextMenu)
)

const DefineThread = () => {
  const { data, id: target } = useData<Data>();
  useUpdate((ctx) => defineThread(ctx, data), [target])
  return null
}

export default function ThreadPage() {
  return (
    <>
      <DefineThread />
      <Page />
    </>
  )
}

const ThreadImagesSkeleton = ({ images_count }: { images_count: number }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-2 items-start w-full">
      {[...Array(images_count)].map((_, i) => (
        <Skeleton key={i} className="w-full h-[200px]" />
      ))}
    </div>
  );
};

const ThreadDetails = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  const properties = ctx.spy(threadPropertiesAtom)
  if (!thread || !properties) return null

  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  const { updated_at } = thread
  const { is_updated, is_saved } = properties
  const isEdited = is_updated && updated_at;

  return (
    <div className="flex flex-col md:flex-row md:items-center w-full justify-start gap-1">
      {isAuthenticated && <ThreadReactions />}
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full gap-1 justify-end">
          {isEdited && (
            <div className="flex items-center w-fit gap-1">
              <Typography textSize="small" textColor="gray">
                изменено в {updated_at}
              </Typography>
            </div>
          )}
        </div>
      </div>
      {(isAuthenticated && typeof is_saved !== 'undefined') && (
        <div className="flex justify-end md:justify-end gap-2 items-center">
          <ThreadSave isMarked={is_saved} />
        </div>
      )}
    </div>
  )
}, "ThreadDetails")

const ThreadTrigger = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  if (!thread) return null;

  return (
    <div className="flex flex-col gap-4 bg-shark-900/40 p-4 rounded-xl w-full">
      <div className="flex flex-col w-fit">
        <Typography className="text-2xl font-semibold" textColor="shark_white">
          {thread.title}
        </Typography>
      </div>
      <ThreadContent />
      {thread.images && (
        <ThreadImages
  
        />
      )}
      <ThreadDetails />
    </div>
  )
}, "Thread")

const Thread = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  if (!isAuthenticated) {
    return <ThreadTrigger />
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">
        <ThreadTrigger />
      </ContextMenuTrigger>
      <ContextMenuContent className="flex flex-col bg-transparent gap-y-2 w-full rounded-md gap-2">
        <ThreadContextMenu />
      </ContextMenuContent>
    </ContextMenu>
  )
}, "Thread")

const Page = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom);

  if (!thread) {
    return (
      <SectionSkeleton />
    )
  }
  
  return (
    <div className="flex xl:flex-row flex-col gap-2 items-start h-full w-full relative">
      <div
        className="flex flex-col order-first w-full gap-2
          xl:min-w-3/4 xl:w-3/4 xl:max-w-3/4 items-start h-full justify-start"
      >
        <Thread />
        <ThreadMore />
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
}, "Page")
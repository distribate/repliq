import { onConnect, onDisconnect } from "@reatom/framework"
import { reatomComponent } from "@reatom/npm-react"
import { savedThreadsAction } from "../models/my-saved-threads.model"
import { ContentNotFound } from "#components/templates/components/content-not-found"
import { ThreadCardSkeleton, ThreadItem } from "#components/collection/my-threads/components/my-threads"

onConnect(savedThreadsAction.dataAtom, savedThreadsAction)
onDisconnect(savedThreadsAction.dataAtom, (ctx) => savedThreadsAction.dataAtom.reset(ctx))

const ThreadsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2 w-full h-fit">
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
    </div>
  )
}

export const MySavedThreads = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(savedThreadsAction.dataAtom)
  const isExist = threads && threads.length >= 1
  const isLoading = ctx.spy(savedThreadsAction.statusesAtom).isPending

  if (isLoading) {
    return <ThreadsSkeleton />
  }

  if (!isExist) {
    return <ContentNotFound title="У вас нет сохраненных тредов" />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2 w-full h-fit">
      {threads.map(thread => (
        <ThreadItem key={thread.id} {...thread} />
      ))}
    </div>
  )
}, "MySavedThreads")
import { Typography } from "@repo/ui/src/components/typography"
import { defineThread, threadAtom, threadPropertiesAtom } from "../models/thread.model"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@repo/ui/src/components/context-menu"
import { ThreadReactions } from "#components/thread/thread-reactions/components/thread-reactions"
import { ContentNotFound } from "#components/templates/components/content-not-found"
import { ThreadImagesSkeleton } from "#components/thread/thread-images/components/thread-images"
import { ThreadSave } from "#components/thread/thread-save/components/thread-save"
import { reatomComponent } from "@reatom/npm-react"
import { PageLoader } from "@repo/ui/src/components/page-loader"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { isAuthenticatedAtom } from "#components/auth/models/auth.model"
import { clientOnly } from "vike-react/clientOnly"

const Content = clientOnly(() => import("#components/thread/thread-content/components/thread-content").then(m => ({ default: m.ThreadContent })))
const ThreadImages = clientOnly(() => import("../../thread-images/components/thread-images").then(m => ({ default: m.ThreadImages })))
const ThreadContextMenu = clientOnly(() => import("#components/thread/thread-context-menu/thread-context-menu").then(m => ({ default: m.ThreadContextMenu })))

const ThreadContent = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  if (!thread) return null

  return (
    <>
      <Content fallback={<Skeleton className="h-[60px] sm:min-h-[200px] w-full" />} />
      {thread.images_count > 0 && (
        <ThreadImages fallback={<ThreadImagesSkeleton images_count={thread.images_count} />} />
      )}
    </>
  )
})

const ThreadDetails = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  const properties = ctx.spy(threadPropertiesAtom)
  if (!thread || !properties) return null

  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  const { updated_at } = thread
  const { is_updated, is_saved } = properties

  return (
    <div className="flex flex-col md:flex-row md:items-center w-full justify-start gap-1">
      {isAuthenticated && <ThreadReactions />}
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full gap-1 justify-end">
          {(is_updated && updated_at) && (
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
})

const ThreadTitle = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  if (!thread) return null;

  return (
    <div className="flex flex-col w-fit">
      <Typography textSize="very_big" className="font-semibold" textColor="shark_white">
        {thread.title}
      </Typography>
    </div>
  )
}, "ThreadTitle")

export const Thread = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)

  if (ctx.spy(defineThread.statusesAtom).isPending) {
    return <PageLoader />
  }

  if (!thread) {
    return <ContentNotFound title="Тред не найден. Возможно он уже удален" />
  }

  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">
        <div className="flex flex-col gap-6 rounded-lg w-full px-4 py-6 bg-shark-950">
          <ThreadTitle />
          <ThreadContent />
          <ThreadDetails />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="flex flex-col bg-transparent gap-y-2 w-full rounded-md gap-2">
        {isAuthenticated && (
          <ThreadContextMenu />
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}, "Thread")
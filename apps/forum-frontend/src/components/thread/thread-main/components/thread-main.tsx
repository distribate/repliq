import { Typography } from "@repo/ui/src/components/typography"
import { threadAction, threadAtom } from "../models/thread.model"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@repo/ui/src/components/context-menu"
import { ThreadReactions } from "#components/thread/thread-reactions/components/thread-reactions"
import { ThreadMainSkeleton } from "./thread-main-skeleton"
import { ThreadContextMenu } from "#components/thread/thread-context-menu/thread-context-menu"
import { ContentNotFound } from "#components/templates/components/content-not-found"
import { ThreadImagesSkeleton } from "#components/thread/thread-images/components/thread-images"
import { Suspense, lazy } from "react"
import { ThreadShare } from "#components/thread/thread-share/components/thread-share"
import { ThreadSave } from "#components/thread/thread-save/components/thread-save"
import { reatomComponent } from "@reatom/npm-react"
import { ThreadContent } from "#components/thread/thread-content/components/thread-content"

const ThreadImages = lazy(() => import("../../thread-images/components/thread-images").then(m => ({ default: m.ThreadImages })))

export const Thread = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)

  if (ctx.spy(threadAction.statusesAtom).isPending) {
    return <ThreadMainSkeleton />
  }

  if (!thread) {
    return <ContentNotFound title="Тред не найден" />
  }

  const { updated_at, properties: { is_updated } } = thread

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">
        <div className="flex flex-col gap-6 rounded-lg w-full py-6 bg-shark-950">
          <div className="flex flex-col w-fit px-4">
            <Typography textSize="very_big" className="font-semibold" textColor="shark_white">
              {thread.title}
            </Typography>
          </div>
          <ThreadContent />
          {thread.images_count > 0 && (
            <Suspense fallback={<ThreadImagesSkeleton images_count={thread.images_count} />}>
              <ThreadImages />
            </Suspense>
          )}
          <div className="flex flex-col md:flex-row md:items-center px-4 w-full justify-start gap-1">
            <ThreadReactions threadId={thread.id} />
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
            <div className="flex justify-end md:justify-end gap-2 items-center">
              <ThreadShare />
              <ThreadSave />
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="flex flex-col bg-transparent gap-y-2">
        <ThreadContextMenu />
      </ContextMenuContent>
    </ContextMenu>
  )
}, "Thread")
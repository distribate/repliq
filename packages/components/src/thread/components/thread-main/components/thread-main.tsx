import { ThreadComments } from "@repo/components/src/thread/components/thread-comments/components/thread-comments.tsx"
import { Typography } from "@repo/ui/src/components/typography"
import { Eye } from "lucide-react"
import { BlockWrapper } from "#wrappers/block-wrapper.tsx"
import { ThreadMore } from "../../thread-more/components/thread-more"
import { ThreadContent } from "../../thread-content/components/thread-content"
import { THREAD_QUERY_KEY, threadQuery } from "../queries/thread-query"
import dayjsInstance from "@repo/lib/constants/dayjs-instance.ts"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@repo/ui/src/components/context-menu"
import { ThreadReactions } from "#thread/components/thread-reactions/components/thread-reactions.tsx"
import { ThreadMainSkeleton } from "./thread-main-skeleton"
import { ThreadCommentsHeader } from "#thread/components/thread-comments/components/thread-comments-header.tsx"
import { ThreadCommentsAnchor } from "#thread/components/thread-comments/components/thread-comments-anchor.tsx"
import { ThreadContextMenu } from "#thread/components/thread-context-menu/thread-context-menu.tsx"
import { useQueryClient } from "@tanstack/react-query"
import { ThreadDetailed } from "@repo/types/entities/thread-type"
import { ContentNotFound } from "#templates/content-not-found.tsx"
import { CommentsDisabled } from "#templates/comments-disabled.tsx"
import { CreateThreadComment } from "#thread/components/create-thread-comment/components/create-thread-comment.tsx"
import { ThreadImages, ThreadImagesSkeleton } from "#thread/components/thread-images/components/thread-images.tsx"
import { Suspense } from "react"

type ThreadContentProps = {
  threadId: string
}

const ThreadCommentsSection = ({
  threadId
}: ThreadContentProps) => {
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))

  if (!thread) return null

  const is_comments = thread.is_comments
  const owner = thread.owner

  return (
    <div className="flex flex-col w-full h-full mt-2 gap-y-4">
      <ThreadCommentsHeader non_comments={!is_comments} />
      {is_comments ? <CreateThreadComment /> : <CommentsDisabled />}
      <ThreadComments owner={owner} id={threadId} is_comments={is_comments} />
      <ThreadCommentsAnchor threadId={threadId} />
    </div>
  )
}

export const Thread = ({
  threadId
}: ThreadContentProps) => {
  const { data: thread, isLoading } = threadQuery(threadId)

  if (isLoading) return <ThreadMainSkeleton />

  if (!thread) return <ContentNotFound title="Тема не найдена" />

  const { 
    created_at, title, updated_at, is_images, is_updated, threads_views_count 
  } = thread

  const dateCreated = dayjsInstance(created_at).format("DD.MM.YYYY")

  return (
    <div className="flex flex-col min-w-3/4 w-3/4 relative max-w-3/4 items-start h-full justify-start">
      <ContextMenu>
        <ContextMenuTrigger className="w-full">
          <div className="flex flex-col gap-6 rounded-lg w-full py-6 bg-primary-color">
            <div className="flex flex-col w-fit px-4">
              <Typography textSize="very_big" className="font-semibold" textColor="shark_white">
                {title}
              </Typography>
              <Typography textColor="gray">
                тема создана{" "}
                <span className="text-caribbean-green-400">{dateCreated}</span> в категории ...
              </Typography>
            </div>
            <ThreadContent threadId={threadId} />
            {is_images && (
              <Suspense fallback={<ThreadImagesSkeleton />}>
                <ThreadImages threadId={threadId} />
              </Suspense>
            )}
            <div className="flex items-center px-4 w-full justify-start gap-1">
              <ThreadReactions threadId={threadId} />
              <div className="flex flex-col w-full gap-2">
                <div className="flex w-full gap-1 justify-end">
                  <div className="flex items-center w-fit gap-1">
                    <Eye size={18} className="text-shark-300" />
                    <Typography textSize="small" textColor="gray">
                      {threads_views_count}
                    </Typography>
                  </div>
                  {(is_updated && updated_at) && (
                    <div className="flex items-center w-fit gap-1">
                      <Typography textSize="small" textColor="gray">
                        изменено в {updated_at}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="flex flex-col gap-y-2">
          <ThreadContextMenu threadId={threadId} />
        </ContextMenuContent>
      </ContextMenu>
      <BlockWrapper padding="without" className="mt-4">
        <ThreadMore threadId={threadId} />
      </BlockWrapper>
      <ThreadCommentsSection threadId={threadId} />
    </div>
  )
}
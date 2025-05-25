import { createFileRoute } from '@tanstack/react-router'
import { Thread } from '#components/thread/thread-main/components/thread-main'
import { threadAtom, threadParamAtom } from '#components/thread/thread-main/models/thread.model'
import { lazy, Suspense } from 'react'
import { ThreadCommentsHeader } from '#components/thread/thread-comments/components/thread-comments-header'
import { CreateThreadComment } from '#components/thread/create-thread-comment/components/create-thread-comment'
import { ThreadComments } from '#components/thread/thread-comments/components/thread-comments'
import { ThreadCommentsAnchor } from '#components/thread/thread-comments/components/thread-comments-anchor'
import { ThreadMore } from '#components/thread/thread-more/components/thread-more'
import { Typography } from '@repo/ui/src/components/typography'
import { reatomComponent } from '@reatom/npm-react'
import { reatomLoader } from '@repo/lib/utils/reatom-loader'
import { take } from '@reatom/framework'
import { ThreadsRecommendations } from '#components/thread/thread-recommendations/components/thread-recommendations'
import { userGlobalOptionsAtom } from '@repo/lib/helpers/get-user'

const CommentsDisabled = lazy(() => import("#components/templates/components/comments-disabled").then(m => ({ default: m.CommentsDisabled })))
const ThreadControl = lazy(() => import("#components/thread/thread-control/components/thread-control").then(m => ({ default: m.ThreadControl })))

export const Route = createFileRoute('/_protected/thread/$id')({
  component: RouteComponent,
  loader: reatomLoader(async (context, routerCtx) => {
    // @ts-expect-error
    threadParamAtom(context, routerCtx.params.id)

    let data = context.get(threadAtom)

    if (!data) {
      data = await take(context, threadAtom)
    }

    return {
      title: data?.title ?? "Не найдено..."
    }
  }),
  head: ({ loaderData }) => ({
    // @ts-expect-error
    meta: [{ title: loaderData?.title ?? "Загрузка..." }]
  })
})

const ThreadCommentsSection = reatomComponent(({ ctx }) => {
  const can_create_comments = ctx.spy(userGlobalOptionsAtom).can_create_comments
  const thread = ctx.spy(threadAtom)

  if (!thread) return null;

  return (
    <div className="flex flex-col w-full h-full mt-4 gap-y-4">
      {thread.properties.is_comments ? (
        <>
          <ThreadCommentsHeader non_comments={!thread.properties.is_comments} />
          {can_create_comments ? (
            <CreateThreadComment />
          ) : (
            <Typography className="text-red-500 text-base">
              Вы были наказаны и теперь не сможете оставлять комментарии!
            </Typography>
          )}
        </>
      ) : (
        <Suspense>
          <CommentsDisabled />
        </Suspense>
      )}
      <ThreadComments owner={thread.owner} properties={thread.properties} />
      {thread.comments_count >= 8 && <ThreadCommentsAnchor threadId={thread.id} />}
    </div>
  )
}, "ThreadCommentsSection")

function RouteComponent() {
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
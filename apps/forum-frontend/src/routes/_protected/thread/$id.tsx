import { createFileRoute, Link } from '@tanstack/react-router'
import { Thread } from '#components/thread/thread-main/components/thread-main'
import { getThreadModel, THREAD_QUERY_KEY } from '#components/thread/thread-main/queries/thread-query'
import { lazy, Suspense } from 'react'
import { ThreadCommentsHeader } from '#components/thread/thread-comments/components/thread-comments-header'
import { ThreadDetailed } from '@repo/types/entities/thread-type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateThreadComment } from '#components/thread/create-thread-comment/components/create-thread-comment'
import { ThreadComments } from '#components/thread/thread-comments/components/thread-comments'
import { ThreadCommentsAnchor } from '#components/thread/thread-comments/components/thread-comments-anchor'
import { ThreadMore } from '#components/thread/thread-more/components/thread-more'
import { forumThreadClient } from '@repo/shared/api/forum-client'
import { createQueryKey } from '@repo/lib/helpers/query-key-builder'
import { Typography } from '@repo/ui/src/components/typography'
import { THREAD_URL } from '@repo/shared/constants/routes'
import { Skeleton } from '@repo/ui/src/components/skeleton'
import { userGlobalOptionsQuery } from '@repo/lib/queries/user-global-options-query'

export const Route = createFileRoute('/_protected/thread/$id')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: THREAD_QUERY_KEY(params.id),
      queryFn: () => getThreadModel(params.id)
    })

    return {
      title: data?.title ?? "Не найдено..."
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Загрузка..."}`
      }
    ]
  })
})

type ThreadContentProps = {
  threadId: string
}

const CommentsDisabled = lazy(() =>
  import("#components/templates/components/comments-disabled").then(m => ({ default: m.CommentsDisabled }))
)

const ThreadControl = lazy(() =>
  import("#components/thread/thread-control/components/thread-control").then(m => ({ default: m.ThreadControl }))
)

const ThreadCommentsSection = ({
  threadId
}: ThreadContentProps) => {
  const { data } = userGlobalOptionsQuery()
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))

  if (!thread || !data) return null;

  const { can_create_comments } = data;

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
      <ThreadComments owner={thread.owner} id={threadId} properties={thread.properties} />
      {thread.comments_count >= 8 && <ThreadCommentsAnchor threadId={threadId} />}
    </div>
  )
}

type GetThreadsRecommendations = {
  exclude: string,
  nickname: string
}

async function getThreadsRecommendations({
  exclude, nickname
}: GetThreadsRecommendations) {
  const res = await forumThreadClient.thread["get-threads-by-owner"][":nickname"].$get({
    param: { nickname },
    query: { exclude }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null
  }

  return data
}

export const THREADS_RECOMMENDATIONS_QUERY_KEY = (nickname: string, exclude: string) =>
  createQueryKey('ui', ['threads', 'recommendations', nickname, exclude])

const threadsRecommendationsQuery = ({
  exclude, nickname
}: {
  exclude?: string,
  nickname?: string
}) => useQuery({
  queryKey: THREADS_RECOMMENDATIONS_QUERY_KEY(nickname!, exclude!),
  queryFn: () => getThreadsRecommendations({ exclude: exclude!, nickname: nickname! }),
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  enabled: !!nickname && !!exclude
})

const ThreadsRecommendations = ({
  threadId
}: {
  threadId: string
}) => {
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))
  const { data, isLoading } = threadsRecommendationsQuery({
    exclude: thread?.id, nickname: thread?.owner.nickname
  })

  if (!thread) return null;

  const threads = data?.data

  if (!threads || !threads.length) return null;

  return (
    <div className="flex flex-col gap-y-4 bg-shark-950 rounded-lg p-4 w-full h-full">
      <Typography textSize="big" className="font-semibold">
        Другие треды, которые вам могут понравиться
      </Typography>
      {isLoading && (
        <>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </>
      )}
      {(threads && threads.length) && threads.map((thread) => (
        <Link
          to={THREAD_URL + thread.id}
          key={thread.id}
          className="flex items-center gap-2 bg-shark-800 border border-shark-700 rounded-lg hover:bg-shark-700 cursor-pointer px-4 py-2"
        >
          {thread.title}
        </Link>
      ))}
    </div>
  )
}

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <div className="flex xl:flex-row flex-col gap-2 items-start h-full w-full relative">
      <div
        className="flex flex-col xl:order-first order-last w-full 
            xl:min-w-3/4 xl:w-3/4 relative xl:max-w-3/4 items-start h-full justify-start"
      >
        <Thread threadId={id} />
        <div className="flex w-full bg-shark-950 rounded-lg mt-4">
          <ThreadMore threadId={id} />
        </div>
        <ThreadCommentsSection threadId={id} />
      </div>
      <div
        className="flex flex-col order-first xl:order-last gap-y-4 
            lg:min-w-1/4 xl:w-1/4 w-full xl:max-w-1/4 h-fit relative xl:sticky top-0 overflow-hidden"
      >
        <Suspense>
          <ThreadControl threadId={id} />
        </Suspense>
        <ThreadsRecommendations threadId={id} />
      </div>
    </div>
  )
}
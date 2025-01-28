import { createFileRoute } from '@tanstack/react-router'
import { Thread } from '@repo/components/src/thread/components/thread-main/components/thread-main'
import { THREAD_QUERY_KEY } from '@repo/components/src/thread/components/thread-main/queries/thread-query'
import { getThreadModel } from '@repo/components/src/thread/queries/get-thread-model'
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { ThreadControl } from '@repo/components/src/thread/components/thread-control/components/thread-control'
import { ThreadShare } from '@repo/components/src/thread/components/thread-share/thread-share'
import { ThreadSave } from '@repo/components/src/thread/components/thread-save/thread-save'
import { ThreadDetailed } from '@repo/types/entities/thread-type'
import { getUser } from '@repo/lib/helpers/get-user'
import { useQueryClient } from '@tanstack/react-query'
import { ThreadCreator } from '@repo/components/src/thread/components/thread-creator/components/thread-creator'
import { Typography } from '@repo/ui/src/components/typography'
import { Button } from '@repo/ui/src/components/button'
import { FriendButton } from '@repo/components/src/buttons/friend-button'
import { Suspense } from 'react'
import { ThreadMainSkeleton } from '@repo/components/src/thread/components/thread-main/components/thread-main-skeleton'

export const Route = createFileRoute('/_protected/thread/$id')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: THREAD_QUERY_KEY(params.id),
      queryFn: () => getThreadModel(params.id)
    })

    return {
      title: data?.title ?? "Загрузка..."
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title}`
      }
    ]
  }),
})

type ThreadContentProps = {
  threadId: string
}

const ThreadOwnerSection = ({
  threadId
}: ThreadContentProps) => {
  const currentUser = getUser()
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))
  if (!thread) return null;

  const isThreadOwner = thread.owner.nickname === currentUser.nickname
  const owner = thread.owner

  return (
    <div className="flex items-center justify-between w-full">
      <ThreadCreator name_color={owner.name_color} nickname={owner.nickname} />
      {isThreadOwner ? (
        <Button state="default" className="px-6">
          <Typography>Это вы</Typography>
        </Button>
      ) : <FriendButton recipient={owner.nickname} />}
    </div>
  )
}

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <Suspense fallback={<ThreadMainSkeleton />}>
        <Thread threadId={id} />
      </Suspense>
      <div className="flex flex-col gap-y-4 min-w-1/4 w-1/4 max-w-1/4 h-fit sticky top-0 overflow-hidden">
        <BlockWrapper>
          <ThreadOwnerSection threadId={id} />
        </BlockWrapper>
        <BlockWrapper>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 items-center h-full">
              <ThreadShare />
              <ThreadSave />
            </div>
          </div>
        </BlockWrapper>
        <ThreadControl threadId={id} />
      </div>
    </div>
  )
}
import { createFileRoute } from '@tanstack/react-router'
import { Thread } from '@repo/components/src/thread/components/thread-main/components/thread-main'
import { THREAD_QUERY_KEY } from '@repo/components/src/thread/components/thread-main/queries/thread-query'
import { getThreadModel } from '@repo/components/src/thread/queries/get-thread-model'

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

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <Thread threadId={id} />
    </div>
  )
}
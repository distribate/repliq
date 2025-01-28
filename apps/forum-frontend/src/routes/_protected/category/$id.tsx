import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'
import { CategoryThreads } from "@repo/components/src/categories/components/category-threads/components/category-threads"
import { Separator } from '@repo/ui/src/components/separator'
import { forumCategoriesClient } from '@repo/shared/api/forum-client'
import { useQuery } from '@tanstack/react-query'
import { createQueryKey } from '@repo/lib/helpers/query-key-builder'

async function getCategory(id: string) {
  const res = await forumCategoriesClient.categories["get-category"][":id"].$get({
    param: { id },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null

  return data
}

const categoryQuery = (id: string) => useQuery({
  queryKey: createQueryKey("ui", ["category", id]),
  queryFn: () => getCategory(id),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
})

export const Route = createFileRoute('/_protected/category/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = categoryQuery(id)

  if (!data) return null

  const category = data.data

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 w-full overflow-hidden">
      <div className="flex flex-col gap-y-4 flex-grow-0 min-w-0 w-full lg:w-3/4">
        <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
          <div className="flex items-center gap-2 px-2">
            <Typography
              textSize="very_big"
              textColor="shark_white"
              className="font-bold"
            >
              {category.title}
            </Typography>
            {category.description && (
              <>
                <Separator orientation="vertical" />
                <Typography>{category.description}</Typography>
              </>
            )}
          </div>
        </BlockWrapper>
        <BlockWrapper className="flex flex-col gap-y-4 w-full overflow-hidden !px-4 py-2">
          <div className="flex flex-col w-full px-2">
            Filtration
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <CategoryThreads category_id={id} />
          </div>
        </BlockWrapper>
      </div>
      <BlockWrapper className="flex flex-col gap-y-4 w-full lg:!w-1/4 flex-grow-0 sticky min-w-0 !p-4 top-0 h-fit">
        s
      </BlockWrapper>
    </div>
  )
}
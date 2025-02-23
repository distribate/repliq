import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'
import { CategoryThreads } from "@repo/components/src/categories/components/category-threads/components/category-threads"
import { forumCategoriesClient } from '@repo/shared/api/forum-client'
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createQueryKey } from '@repo/lib/helpers/query-key-builder'
import { Input } from '@repo/ui/src/components/input'
import { Grid, List, Search } from "lucide-react"
import { cva, VariantProps } from 'class-variance-authority'
import { HTMLAttributes, Suspense } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@repo/ui/src/components/dropdown-menu'

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

const CategoryThreadsSearch = () => {

  return (
    <div
      className="flex items-center gap-4 h-12 px-4 w-full lg:w-3/4 rounded-lg duration-300 
        ease-in-out transtion-all bg-shark-950 outline-none 
        focus-within:outline focus-within:outline-2 focus-within:outline-biloba-flower-500"
    >
      <Search size={24} className="text-shark-300" />
      <Input
        placeholder="Название треда"
        backgroundType="transparent"
        className="text-xl !p-0"
      />
    </div>
  )
}

const categoryThreadsListLayoutVariants = cva("w-full h-full", {
  variants: {
    variant: {
      grid: "grid lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-4",
      cols: "flex flex-col gap-4"
    }
  },
  defaultVariants: {
    variant: "cols"
  }
})

type CategoryThreadsListLayoutProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof categoryThreadsListLayoutVariants>

const CategoryThreadsListLayout = ({ className, variant, ...props }: CategoryThreadsListLayoutProps) => {
  return <div className={categoryThreadsListLayoutVariants({ className, variant })} {...props} />
}

type CategoryThreadsFilterQuery = {
  view: "grid" | "cols",
  sort: "created_at" | "views"
}

export const CATEGORY_THREADS_FILTER_QUERY_KEY = createQueryKey("ui", ["category-threads", "filter"])

const categoryThreadsFilterQuery = () => useSuspenseQuery<CategoryThreadsFilterQuery, Error>({
  queryKey: CATEGORY_THREADS_FILTER_QUERY_KEY,
  initialData: {
    view: "cols",
    sort: "created_at"
  }
})

const CategoryThreadsList = ({ category_id }: { category_id: string }) => {
  const { data: filtering } = categoryThreadsFilterQuery()

  return (
    <CategoryThreadsListLayout variant={filtering.view}>
      <CategoryThreads category_id={category_id} />
    </CategoryThreadsListLayout>
  )
}

const CategoryThreadsFilter = () => {
  const qc = useQueryClient()
  const { data: { view, sort } } = categoryThreadsFilterQuery()

  const updateFilter = (type: "view" | "sort", value: "grid" | "cols" | "created_at" | "views") => {
    qc.setQueryData(CATEGORY_THREADS_FILTER_QUERY_KEY, (prev: CategoryThreadsFilterQuery) => ({
      ...prev, [type]: value
    }))
  }

  return (
    <div className="flex items-center gap-1  w-full lg:w-1/4 h-full">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 p-4 rounded-lg bg-shark-950 w-full h-12"
          onClick={() => updateFilter("sort", sort === 'created_at' ? 'views' : 'created_at')}
        >
          <Typography className="font-semibold text-lg text-shark-200">
            Сортировать по:
          </Typography>
          <Typography className="font-semibold text-lg text-shark-300">
            {sort === 'created_at' ? 'Дата' : 'Просмотры'}
          </Typography>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="flex flex-col gap-2 w-full">
          <DropdownMenuItem
            onClick={() => updateFilter("sort", "created_at")}
          >
            <Typography className="text-lg">
              Сначала новые
            </Typography>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateFilter("sort", "views")}
          >
            <Typography className="text-lg">
              Сначала популярные
            </Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        className="flex items-center p-4 rounded-lg bg-shark-950 cursor-pointer hover:bg-shark-900 aspect-square h-12"
        onClick={() => updateFilter("view", view === "cols" ? "grid" : "cols")}
      >
        {view === "cols" ? <Grid size={24} className="text-shark-300" /> : <List size={24} className="text-shark-300" />}
      </div>
    </div>
  )
}

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isError } = categoryQuery(id)

  if (isError) return <Typography>Ошибка загрузки категории</Typography>

  if (!data) return null

  const category = data.data

  return (
    <div className="flex flex-col gap-4 w-full p-1">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        <div className="flex flex-col gap-2">
          <Typography
            textSize="very_big"
            textColor="shark_white"
            className="font-bold"
          >
            {category.title}
          </Typography>
          {category.description && (
            <>
              <Typography textColor="shark_white" textSize="large">
                {category.description}
              </Typography>
            </>
          )}
        </div>
      </BlockWrapper>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-2">
        <CategoryThreadsSearch />
        <CategoryThreadsFilter />
      </div>
      <BlockWrapper className="flex flex-col gap-4 w-full overflow-hidden p-2">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Треды
        </Typography>
        <Suspense>
          <CategoryThreadsList category_id={id} />
        </Suspense>
      </BlockWrapper>
    </div>
  )
}
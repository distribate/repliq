import { Typography } from '@repo/ui/src/components/typography'
import { CategoryThreads } from "#components/category/threads/components/category-threads"
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { categoryAtom, categoryIdAtom } from '#components/category/threads/models/category.model'
import { CategoryThreadsSearch } from '#components/category/threads/components/category-threads-search'
import { CategoryThreadsFilter } from '#components/category/threads/components/category-threads-filter'
import { batch } from '@reatom/core'
import { useData } from 'vike-react/useData'
import { Data } from './+data'

const Sync = () => {
  const { data, id } = useData<Data>();

  useUpdate((ctx) => {
    batch(ctx, () => {
      categoryAtom(ctx, data)
      categoryIdAtom(ctx, id)
    })
  }, [id])

  return null;
}

const CategoryInfo = reatomComponent(({ ctx }) => {
  const category = ctx.spy(categoryAtom)
  if (!category) return null

  return (
    <div className="flex flex-col bg-primary-color rounded-lg gap-2 w-full !p-4">
      <div className="flex flex-col gap-2">
        <Typography textSize="very_big" textColor="shark_white" className="font-bold">
          {category.title}
        </Typography>
        {category.description && (
          <Typography textColor="shark_white" textSize="large">
            {category.description}
          </Typography>
        )}
      </div>
    </div>
  )
}, "CategoryInfo")

export default function Page() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Sync />
      <CategoryInfo />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-2">
        <CategoryThreadsSearch />
        <CategoryThreadsFilter />
      </div>
      <div className="flex flex-col bg-primary-color rounded-lg gap-4 w-full overflow-hidden p-2">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Треды
        </Typography>
        <CategoryThreads />
      </div>
    </div>
  )
}
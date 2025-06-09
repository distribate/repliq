import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { CategoryThreadsList } from "#components/categories/components/threads/components/category-threads"
import { reatomComponent } from '@reatom/npm-react'
import { categoryIdAtom, categoryResource } from '#components/categories/components/threads/models/category.model'
import { CategoryThreadsSearch } from '#components/categories/components/threads/components/category-threads-search'
import { CategoryThreadsFilter } from '#components/categories/components/threads/components/category-threads-filter'

const CaregoryInfo = reatomComponent(({ ctx }) => {
  const category = ctx.spy(categoryResource.dataAtom)?.data
  if (!category) return null

  return (
    <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
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
    </BlockWrapper>
  )
})

const Category = reatomComponent(({ ctx }) => {
  const category = ctx.spy(categoryResource.dataAtom)?.data
  const isError = ctx.spy(categoryResource.statusesAtom).isRejected

  if (isError) return <Typography>Ошибка загрузки категории</Typography>

  if (!category) return null

  return (
    <>
      <BlockWrapper className="flex flex-col gap-4 w-full overflow-hidden p-2">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Треды
        </Typography>
        <CategoryThreadsList category_id={ctx.spy(categoryIdAtom)!} />
      </BlockWrapper>
    </>
  )
}, "Category")

export function CategoryRouteComponent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <CaregoryInfo />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-2">
        <CategoryThreadsSearch />
        <CategoryThreadsFilter />
      </div>
      <Category />
    </div>
  )
}
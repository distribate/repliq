import { reatomComponent } from "@reatom/npm-react"
import { categoryThreadsSortAtom, categoryThreadsViewAtom } from "../models/category-filter.model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu"
import { Typography } from "@repo/ui/src/components/typography"
import { Grid, List } from "lucide-react"
import { action, AtomState } from "@reatom/core"
import { updateCategoryThreadsAction } from "../models/category-threads.model"

const updateThreadsAction = action((ctx, sort: AtomState<typeof categoryThreadsSortAtom>) => {
  categoryThreadsSortAtom(ctx, sort)
  updateCategoryThreadsAction(ctx, "update-filter")
}, "updateThreadsAction")

const CategoryThreadsSort = reatomComponent(({ ctx }) => {
  const current = ctx.spy(categoryThreadsSortAtom)

  const updateSort = (s: AtomState<typeof categoryThreadsSortAtom>) => updateThreadsAction(ctx, s)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 p-4 rounded-lg bg-shark-950 w-full h-12"
          onClick={() => updateSort(current === 'created_at' ? 'views_count' : 'created_at')}
        >
          <Typography className="font-semibold text-lg text-shark-200">
            Сортировать по:
          </Typography>
          <Typography className="font-semibold text-lg text-shark-300">
            {current === 'created_at' ? 'Дата' : 'Просмотры'}
          </Typography>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="flex flex-col gap-2 w-full">
          <DropdownMenuItem onClick={() => updateSort("created_at")}>
            <Typography className="text-lg">
              Сначала новые
            </Typography>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSort("views_count")}>
            <Typography className="text-lg">
              Сначала популярные
            </Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}, "CategoryThreadsSort")

const CategoryThreadsView = reatomComponent(({ ctx }) => {
  const current = ctx.spy(categoryThreadsViewAtom)

  const updateView = (v: AtomState<typeof categoryThreadsViewAtom>) => categoryThreadsViewAtom(ctx, v)

  return (
    <div
      className="flex items-center p-4 rounded-lg bg-shark-950 cursor-pointer hover:bg-shark-900 aspect-square h-12"
      onClick={() => updateView(current === "cols" ? "grid" : "cols")}
    >
      {current === "cols"
        ? <Grid size={24} className="text-shark-300" />
        : <List size={24} className="text-shark-300" />
      }
    </div>
  )
}, "CategoryThreadsView")

export const CategoryThreadsFilter = () => {
  return (
    <div className="flex items-center gap-1 w-full lg:w-1/4 h-full">
      <CategoryThreadsSort />
      <CategoryThreadsView />
    </div>
  )
}
import { reatomComponent } from "@reatom/npm-react"
import { categoryThreadFilterAtom } from "../models/category-filter.model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu"
import { Typography } from "@repo/ui/src/components/typography"
import { Grid, List } from "lucide-react"
import { CategoryThreadsFilter as CategoryThreadsFilterType } from '#components/categories/components/category-threads/models/category-filter.model'

export const CategoryThreadsFilter = reatomComponent(({ ctx }) => {
  const { view, sort } = ctx.spy(categoryThreadFilterAtom)

  const updateView = (view: CategoryThreadsFilterType["view"]) => {
    categoryThreadFilterAtom(ctx, (state) => ({ ...state, view }))
  }

  const updateSort = (sort: CategoryThreadsFilterType["sort"]) => {
    categoryThreadFilterAtom(ctx, (state) => ({ ...state, sort }))
  }

  return (
    <div className="flex items-center gap-1  w-full lg:w-1/4 h-full">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 p-4 rounded-lg bg-shark-950 w-full h-12"
          onClick={() => updateSort(sort === 'created_at' ? 'views' : 'created_at')}
        >
          <Typography className="font-semibold text-lg text-shark-200">
            Сортировать по:
          </Typography>
          <Typography className="font-semibold text-lg text-shark-300">
            {sort === 'created_at' ? 'Дата' : 'Просмотры'}
          </Typography>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="flex flex-col gap-2 w-full">
          <DropdownMenuItem onClick={() => updateSort("created_at")}>
            <Typography className="text-lg">
              Сначала новые
            </Typography>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSort("views")}>
            <Typography className="text-lg">
              Сначала популярные
            </Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        className="flex items-center p-4 rounded-lg bg-shark-950 cursor-pointer hover:bg-shark-900 aspect-square h-12"
        onClick={() => updateView(view === "cols" ? "grid" : "cols")}
      >
        {view === "cols"
          ? <Grid size={24} className="text-shark-300" />
          : <List size={24} className="text-shark-300" />
        }
      </div>
    </div>
  )
}, "CategoryThreadsFilter")
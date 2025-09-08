import { action } from "@reatom/core"
import { sleep, withConcurrency } from "@reatom/framework"
import { Input } from "@repo/ui/src/components/input"
import { IconSearch } from "@tabler/icons-react"
import { categoryThreadsSearchQueryAtom, updateCategoryThreadsAction } from "../models/category-threads.model"
import { reatomComponent } from "@reatom/npm-react"

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  await ctx.schedule(() => sleep(300));

  categoryThreadsSearchQueryAtom(ctx, value)

  await ctx.schedule(() => sleep(40));
  
  updateCategoryThreadsAction(ctx, "update-filter")
}, "categoryThreadsOnChange").pipe(withConcurrency())

export const CategoryThreadsSearch = reatomComponent(({ ctx }) => {
  return (
    <div
      className="flex items-center gap-4 h-12 px-4 w-full lg:w-3/4 rounded-lg duration-300 
        ease-in-out transtion-all bg-shark-950 outline-none 
        focus-within:outline focus-within:outline-2 focus-within:outline-biloba-flower-500"
    >
      <IconSearch size={24} className="text-shark-300" />
      <Input
        placeholder="Название треда"
        backgroundType="transparent"
        className="text-xl !p-0"
        onChange={e => onChange(ctx, e)}
      />
    </div>
  )
}, "CategoryThreadsSearch")
import { CustomLink } from "#shared/components/link"
import { availableCategoriesAction } from "#components/thread/create-thread/models/thread-form.model"
import { reatomComponent } from "@reatom/npm-react"
import { Typography } from "@repo/ui/src/components/typography"
import { onConnect } from "@reatom/framework"

const SearchThreadsCategory = ({ 
  id, title, color, emoji 
}: { 
  id: number, color: string | null, title: string, emoji: string 
}) => {
  return (
    <CustomLink
      to={`/category/` + id}
      key={id}
      style={{ backgroundColor: color ?? undefined }}
      className="flex flex-col relative h-[80px] md:aspect-video w-full md:h-full p-3 lg:p-4 rounded-lg"
    >
      <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
        {title}
      </Typography>
      <img
        src={emoji}
        draggable={false}
        alt=""
        width={52}
        height={52}
        className="absolute bottom-4 right-4 rotate-[15deg]"
      />
    </CustomLink>
  )
}

onConnect(availableCategoriesAction.dataAtom, availableCategoriesAction);

export const SearchThreadsCategories = reatomComponent(({ ctx }) => {
  const categories = ctx.spy(availableCategoriesAction.dataAtom)
  if (!categories) return null

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
        Категории
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-4 w-full h-full">
        {categories.map(({ id, color, title, emoji }) => (
          <SearchThreadsCategory key={id} id={id} title={title} color={color} emoji={emoji} />
        ))}
      </div>
    </div>
  )
}, "SearchCategories")
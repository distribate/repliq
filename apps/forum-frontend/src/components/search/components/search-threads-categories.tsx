import { CustomLink } from "#components/shared/link"
import { availableCategoriesResource } from "#components/thread/create-thread/models/thread-form.model"
import { reatomComponent } from "@reatom/npm-react"
import { CATEGORY_URL } from "@repo/shared/constants/routes"
import { Typography } from "@repo/ui/src/components/typography"

const SearchThreadsCategory = ({ id, title, color, emoji }: { id: number, color: string | null, title: string, emoji: string }) => {
  return (
    <CustomLink
      to={CATEGORY_URL + id}
      key={id}
      // @ts-expect-error
      style={{ backgroundColor: color ?? undefined }}
      className="flex flex-col relative cursor-pointer h-[80px] md:aspect-video hover:bg-shark-700 w-full md:h-full p-3 lg:p-4 rounded-lg bg-shark-950"
    >
      <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
        {title}
      </Typography>
      <img src={emoji} draggable={false} alt="" width={52} height={52} className="absolute bottom-4 right-4 rotate-[15deg]" />
    </CustomLink>
  )
}

export const SearchThreadsCategories = reatomComponent(({ ctx }) => {
  const categories = ctx.spy(availableCategoriesResource.dataAtom)
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
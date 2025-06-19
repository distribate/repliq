import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { latestNewsResource } from "./latest-news.model"
import { CustomLink } from "#components/shared/link"

const NewsItem = ({ title, description, imageUrl }: { id: string, imageUrl: string, title: string, description: string }) => {
  return (
    <div className="flex group flex-col rounded-lg h-[200px] relative overflow-hidden">
      <img
        src={imageUrl}
        alt=""
        width={600}
        height={200}
        className="group-hover:scale-110 transition-all duration-300 w-full ease-in-out max-h-[200px] object-cover rounded-lg"
      />
      <div className="flex absolute bg-gradient-to-t from-shark-950 group-hover:via-shark-950/90 via-shark-950/70 to-transparent bottom-0 p-4 w-full flex-col">
        <Typography className="text-[18px] translate-y-12 group-hover:-translate-y-2 transition-all duration-300 ease-in-out font-semibold">
          {title}
        </Typography>
        <Typography textColor="gray" className="translate-y-24 group-hover:-translate-y-0 transition-all duration-300 ease-in-out text-[16px]">
          {description.slice(0, 64) + "..."}
        </Typography>
      </div>
    </div>
  )
}

const LatestNewsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </>
  )
}

export const LatestNews = reatomComponent(({ ctx }) => {
  const newsList = ctx.spy(latestNewsResource.dataAtom)
  const isExist = newsList && newsList.length > 0

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Последние новости
      </Typography>
      <div className="grid grid-cols-2 xl:grid-cols-1 w-full gap-4">
        {ctx.spy(latestNewsResource.statusesAtom).isPending && <LatestNewsSkeleton />}
        {isExist ? newsList.map((item) => (
          <NewsItem key={item.id} {...item} />
        )) : (
          <span>Пока ничего нет</span>
        )}
      </div>
      <CustomLink to="/news">
        <Typography textColor="gray" className="text-[16px]">
          показать больше
        </Typography>
      </CustomLink>
    </div>
  )
}, "LatestNews")
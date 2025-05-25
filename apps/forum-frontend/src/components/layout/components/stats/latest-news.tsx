import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { reatomComponent } from "@reatom/npm-react"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { Link } from "@tanstack/react-router"

const getLatestNews = async () => {
  const res = await forumSharedClient.shared["get-news"].$get({
    query: { limit: "2", ascending: "true" }
  })

  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

const latestNewsResource =reatomResource(async (ctx) => {
  return await ctx.schedule(() => getLatestNews())
}).pipe(withDataAtom(), withCache(), withStatusesAtom())

export const LatestNews = reatomComponent(({ ctx }) => {
  const newsList = ctx.spy(latestNewsResource.dataAtom)
  const isLoading = ctx.spy(latestNewsResource.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Последние новости
      </Typography>
      <div className="flex flex-col gap-y-4 w-full h-full">
        {isLoading && (
          <>
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </>
        )}
        {newsList && newsList.map((newsItem) => (
          <div key={newsItem.id} className="flex group flex-col rounded-lg h-[200px] relative overflow-hidden">
            <img
              src={newsItem.imageUrl}
              alt=""
              width={600}
              height={200}
              className="group-hover:scale-110 transition-all duration-300 ease-in-out max-h-[200px] object-cover rounded-lg"
            />
            <div className="flex absolute bg-gradient-to-t from-shark-950 group-hover:via-shark-950/90 via-shark-950/70 to-transparent bottom-0 p-4 w-full flex-col">
              <Typography className="text-[18px] translate-y-12 group-hover:-translate-y-2 transition-all duration-300 ease-in-out font-semibold">
                {newsItem.title}
              </Typography>
              <Typography textColor="gray" className="translate-y-24 group-hover:-translate-y-0 transition-all duration-300 ease-in-out text-[16px]">
                {newsItem.description.slice(0, 64) + "..."}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      {/* @ts-ignore */}
      <Link to="https://fasberry.su/news">
        <Typography textColor="gray" className="text-[16px]">
          показать больше
        </Typography>
      </Link>
    </div>
  )
}, "LatestNews")
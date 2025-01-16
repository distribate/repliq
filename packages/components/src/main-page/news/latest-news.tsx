"use client"

import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumLandingClient } from "@repo/shared/api/forum-client"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

const getLatestNews = async () => {
  const res = await forumLandingClient["get-news"].$get({
    query: {
      limit: "2",
      ascending: "true",
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

const latestNewsQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["latest-news"]),
  queryFn: () => getLatestNews(),
  refetchOnMount: false,
  refetchOnWindowFocus: false
})

export const LatestNews = () => {
  const { data: newsList } = latestNewsQuery()

  if (!newsList) return null;

  return (
    <div className="flex flex-col border border-shark-800 gap-y-2 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Последние новости
      </Typography>
      <div className="flex flex-col gap-y-4 w-full h-full">
        {newsList.map((newsItem)=> (
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
      <Link href="https://fasberry.su/news">
        <Typography textColor="gray" className="text-[16px]">
          показать больше
        </Typography>
      </Link>
    </div>
  )
}
"use client"

import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumSharedClient } from "@repo/shared/api/forum-client";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { useQuery } from "@tanstack/react-query";

const factQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["random-fact"]),
  queryFn: async () => {
    const res = await forumSharedClient.shared["get-fact"].$get()

    const data = await res.json();

    if (!data || "error" in data) {
      return null;
    }

    return data.fact
  }
})

export const FactSection = () => {
  const { data: fact, isLoading } = factQuery()

  if (isLoading) return (
    <div className="flex gap-1 select-none relative minecraft-panel w-full items-start py-2 px-4 lg:px-10 overflow-x-scroll max-w-[1020px]">
      <Skeleton className="h-8 w-full" />
    </div>
  )

  return (
    <div className="flex gap-1 select-none relative minecraft-panel w-full items-start py-2 px-4 lg:px-10 overflow-x-scroll max-w-[1020px]">
      <Typography
        font="minecraft"
        className="text-shark-800 text-[14px] lg:text-base font-semibold"
      >
        Факт: <span className="whitespace-normal font-medium">{fact ? fact.toString() : "ничего не нашлось"}</span>
      </Typography>
    </div>
  )
};
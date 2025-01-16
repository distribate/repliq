"use client"

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";
import { newsFiltrationQuery, useUpdateNews } from "./news-page-search";
import { NEWS_QUERY_KEY } from "@repo/lib/queries/news-query";
import { NewsType } from "./news-item-wrapper";

export const NewsPageListInView = () => {
  const qc = useQueryClient()
  const { ref, inView } = useInView({ threshold: 1 })
  const { data: { hasNextPage } } = newsFiltrationQuery()
  const { updateNewsMutation } = useUpdateNews()

  useEffect(() => {
    if (inView && hasNextPage) {
      const cursor = qc.getQueryData<NewsType>(NEWS_QUERY_KEY)?.meta?.endCursor

      updateNewsMutation.mutate({ cursor })
    }
  }, [inView, hasNextPage]);

  return hasNextPage && <div ref={ref} className="h-[1px] w-full border" />
}
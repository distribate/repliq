import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { forumSharedClient } from '@repo/shared/api/forum-client';
import { getNewsSchema } from "@repo/types/schemas/news/get-news-schema.ts";
import { z } from 'zod';

export const NEWS_QUERY_KEY = ['news'];

export const getNews = async ({
  ascending, cursor, limit, searchQuery
}: z.infer<typeof getNewsSchema>) => {
  const res = await forumSharedClient.shared["get-news"].$get({
    query: {
      ascending: ascending ? ascending.toString() : undefined,
      limit: limit ? limit.toString() : undefined,
      cursor: cursor ? cursor.toString() : undefined,
      searchQuery
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data;
}

export const newsQuery = (values: z.infer<typeof getNewsSchema>) => useQuery({
  queryKey: NEWS_QUERY_KEY,
  queryFn: () => getNews(values),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData
})
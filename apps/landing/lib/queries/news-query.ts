import { useQuery } from '@tanstack/react-query';
import { getNews, NewsDetailsType } from '#/lib/queries/get-news';

export const NEWS_QUERY_KEY = [ 'news' ];

export const newsQuery = ({
  sort, range, limit,
}: NewsDetailsType) => useQuery({
  queryKey: NEWS_QUERY_KEY,
  queryFn: () => getNews({ limit, range, sort }),
  refetchOnMount: false,
  refetchOnWindowFocus: true,
});
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUserSummary } from './get-user-summary.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

const USER_CARD_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["card"], nickname)

export const userCardQuery = (nickname: string) => useQuery({
  queryKey: USER_CARD_QUERY_KEY(nickname),
  queryFn: () => getUserSummary(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
});
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { forumUserClient } from '@repo/shared/api/forum-client';

const USER_CARD_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["card"], nickname)

async function getUserSummary(nickname: string) {
  const res = await forumUserClient.user["get-user-summary"][":nickname"].$get({
    param: { nickname },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data
}

export const userCardQuery = (nickname: string) => useQuery({
  queryKey: USER_CARD_QUERY_KEY(nickname),
  queryFn: () => getUserSummary(nickname),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData
});
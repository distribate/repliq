import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';

export const FAVORITE_ITEM_DONATE_QUERY_KEY = (favoriteItem: number) =>
  createQueryKey('user', [ 'favorite-item' ], favoriteItem);

async function getDonate(favoriteItem: number) {
  return {
    id: 1,
    title: "asd",
    image: "asd"
  }
}

export const donateQuery = (favoriteItem: Pick<UserDetailed, "favorite_item">["favorite_item"], enabled: boolean) => useQuery({
  queryKey: FAVORITE_ITEM_DONATE_QUERY_KEY(favoriteItem!),
  queryFn: () => getDonate(favoriteItem!),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled: !!favoriteItem && enabled
});
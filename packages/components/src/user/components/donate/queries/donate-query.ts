import { useQuery } from '@tanstack/react-query';
import { FavoriteItem, getFavoriteItem } from '@repo/lib/queries/get-favorite-item.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';

export const FAVORITE_ITEM_DONATE_QUERY_KEY = (favoriteItem: number) =>
  createQueryKey('user', [ 'favorite-item' ], favoriteItem);

async function getDonate(favoriteItem: number): Promise<FavoriteItem | null> {
  return await getFavoriteItem({ type: 'itemId', favorite_item: favoriteItem })
}

export const donateQuery = (favoriteItem: Pick<UserDetailed, "favorite_item">["favorite_item"], enabled: boolean) => useQuery({
  queryKey: FAVORITE_ITEM_DONATE_QUERY_KEY(favoriteItem!),
  queryFn: () => getDonate(favoriteItem!),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled: !!favoriteItem && enabled
});
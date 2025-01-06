import {
  FavoriteItemType,
  getFavoriteItem,
} from "@repo/lib/queries/get-favorite-item.ts";
import { useQuery } from "@tanstack/react-query";

export const FAVORITE_ITEM_QUERY_KEY = (
  favorite_item?: number | null
) => ["ui", "favorite-item", favorite_item];

export const favoriteItemQuery = ({
  favorite_item,
  nickname,
  type,
}: FavoriteItemType) => useQuery({
  queryKey: FAVORITE_ITEM_QUERY_KEY(favorite_item),
  queryFn: () => getFavoriteItem({ favorite_item, type, nickname }),
  refetchOnWindowFocus: false,
  enabled: !!favorite_item,
});

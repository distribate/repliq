
import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";

export const FAVORITE_ITEM_QUERY_KEY = (fi: number) => createQueryKey("ui", ["favorite-item", `${fi}`]);

export const favoriteItemQuery = ({
  favorite_item, nickname, type,
}: {
  favorite_item: number,
  nickname: string,
  type: string
}) => useQuery({
  queryKey: FAVORITE_ITEM_QUERY_KEY(favorite_item!),
  queryFn: () => { return { id: 2, title: "asd", image: "asd" } },
  refetchOnWindowFocus: false,
  enabled: !!favorite_item,
});
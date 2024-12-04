import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FavoriteItemsSkeleton } from "./favorite-items-skeleton.tsx";
import { favoriteItemsQuery } from "../queries/favorite-items-query.ts";
import { FavoriteItem } from "./favorite-item.tsx";

export const FavoriteItems = () => {
  const { data: items, isLoading } = favoriteItemsQuery();

  return (
    <div className="flex flex-col gap-4 items-center px-3 w-full">
      <Typography variant="dialogTitle">Любимый предмет</Typography>
      <div className="flex flex-col items-start gap-y-2 w-full">
        <Typography>Доступные предметы</Typography>
        {isLoading ? (
          <FavoriteItemsSkeleton />
        ) : items ? (
          <div className="grid grid-flow-col grid-rows-4 overflow-y-scroll max-h-[540px] gap-2 w-full">
            {items.map((item) => (
              <FavoriteItem key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <Typography>пусто</Typography>
        )}
      </div>
    </div>
  );
};

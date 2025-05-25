import { Typography } from "@repo/ui/src/components/typography.tsx";
import { favoriteItemsResource } from "../models/favorite-items.model.ts";
import { FavoriteItem } from "./favorite-item.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { reatomComponent } from "@reatom/npm-react";

const FavoriteItemsSkeleton = () => {
  return (
    <div className="grid grid-flow-col grid-rows-4 overflow-y-scroll max-h-[540px] gap-2 w-full">
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
      <Skeleton className="w-full h-[112px]" />
    </div>
  );
};

export const FavoriteItems = reatomComponent(({ ctx }) => {
  const items = ctx.spy(favoriteItemsResource.dataAtom)
  const isLoading = ctx.spy(favoriteItemsResource.statusesAtom).isPending 

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
}, "FavoriteItems")
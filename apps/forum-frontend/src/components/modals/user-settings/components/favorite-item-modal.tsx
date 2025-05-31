import { favoriteItemAction } from "#components/cards/user-personal-card/components/profile-settings/components/favorite-items/models/favorite-item.model";
import { useUpdate } from "@reatom/npm-react";

export const SyncFavoriteItem = ({ target }: { target: string }) => {
  useUpdate((ctx) => favoriteItemAction(ctx, target), [target])
  return null;
}
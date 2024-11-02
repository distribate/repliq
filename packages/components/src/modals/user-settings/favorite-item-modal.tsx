import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  FavoriteItems
} from '#cards/components/user-personal-card/components/profile-settings/components/favorite-items/components/favorite-items.tsx';
import {
  favoriteItemQuery
} from '#cards/components/user-personal-card/components/profile-settings/components/favorite-items/queries/favorite-item-query.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const FavoriteItemModal = () => {
  const currentUser = getUser();
  const favoriteItemId = currentUser?.favorite_item;
  
  const { data: favoriteItem } = favoriteItemQuery({
    favorite_item: favoriteItemId
  });
  
  if (!currentUser) return null;
  
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-1">
          <Typography className="text-base">
            {favoriteItem && favoriteItemId ? favoriteItem.title : 'не выбрано'}
          </Typography>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <FavoriteItems />
      </DialogContent>
    </Dialog>
  )
}
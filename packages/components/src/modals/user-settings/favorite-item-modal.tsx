import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  FavoriteItems
} from '../../cards/components/user-personal-card/components/profile-settings/components/favorite-items/components/favorite-items.tsx';
import {
  favoriteItemQuery
} from '../../cards/components/user-personal-card/components/profile-settings/components/favorite-items/queries/favorite-item-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

export const FavoriteItemModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
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
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  FavoriteItems
} from '../../cards/components/user-personal-card/components/profile-settings/components/favorite-items/components/favorite-items.tsx';
import {
  favoriteItemQuery
} from '../../cards/components/user-personal-card/components/profile-settings/components/favorite-items/queries/favorite-item-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export const FAVORITE_ITEM_MODAl_NAME = "favorite_item"

export const FavoriteItemModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const favorite_item = currentUser?.favorite_item;
  
  const { data: favoriteItem } = favoriteItemQuery({
    favorite_item
  });
  
  return (
    <DialogWrapper
      properties={{ dialogContentClassName: 'max-w-2xl' }}
      name={FAVORITE_ITEM_MODAl_NAME}
      trigger={
        <div className="flex items-center gap-1">
          <Typography className="text-base">
            {favoriteItem && favorite_item ? favoriteItem.title : 'не выбрано'}
          </Typography>
        </div>
      }
    >
      <FavoriteItems />
    </DialogWrapper>
  )
}
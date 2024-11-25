import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  FavoriteItems,
} from '#cards/components/user-personal-card/components/profile-settings/components/favorite-items/components/favorite-items.tsx';
import {
  favoriteItemQuery,
} from '#cards/components/user-personal-card/components/profile-settings/components/favorite-items/queries/favorite-item-query.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import DiamondPickaxe from '@repo/assets/images/minecraft/diamond_pickaxe.webp';
import {
  UserSettingOption,
} from '#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';

export const FavoriteItemModal = () => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const favoriteItemId = currentUser.favorite_item;
  const { data: favoriteItem } = favoriteItemQuery({
    favorite_item: favoriteItemId
  });
  
  return (
    <Dialog>
      <DialogTrigger>
        <UserSettingOption title="Любимый предмет" imageSrc={DiamondPickaxe.src}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {favoriteItem && favoriteItemId ? favoriteItem.title : 'не выбрано'}
            </Typography>
          </div>
        </UserSettingOption>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <FavoriteItems />
      </DialogContent>
    </Dialog>
  );
};
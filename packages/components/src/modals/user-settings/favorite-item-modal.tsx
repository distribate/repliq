import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FavoriteItems } from "#cards/components/user-personal-card/components/profile-settings/components/favorite-items/components/favorite-items.tsx";
import { favoriteItemQuery } from "#cards/components/user-personal-card/components/profile-settings/components/favorite-items/queries/favorite-item-query.ts";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import DiamondPickaxe from "@repo/assets/images/minecraft/diamond_pickaxe.webp";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";

export const FavoriteItemModal = () => {
  const { favorite_item } = getUser();
  const { data: favoriteItem } = favoriteItemQuery({ favorite_item });

  return (
    <Dialog>
      <DialogTrigger>
        <UserSettingOption
          title="Любимый предмет"
          imageSrc={DiamondPickaxe}
        >
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {favoriteItem && favorite_item ? favoriteItem.title : "не выбрано"}
            </Typography>
          </div>
        </UserSettingOption>
      </DialogTrigger>
      <DialogContent className="!lg:w-[600px]">
        <FavoriteItems />
      </DialogContent>
    </Dialog>
  );
};
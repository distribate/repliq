import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FavoriteItems } from "#components/cards/user-personal-card/components/profile-settings/components/favorite-items/components/favorite-items.tsx";
import { favoriteItemAction, favoriteItemAtom } from "#components/cards/user-personal-card/components/profile-settings/components/favorite-items/models/favorite-item.model";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import DiamondPickaxe from "@repo/assets/images/minecraft/diamond_pickaxe.webp";
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";
import { updateCurrentUserAction } from "#components/cards/user-personal-card/components/profile-settings/models/update-current-user.model";

const Sync = ({ target }: { target: string }) => {
  useUpdate((ctx) => favoriteItemAction(ctx, target), [target])
  return null;
}

export const FavoriteItemModal = reatomComponent(({ ctx }) => {
  const nickname = getUser(ctx).nickname;
  const favoriteItem = ctx.spy(favoriteItemAtom)

  return (
    <>
      <Sync target={nickname} />
      <DynamicModal
        isPending={ctx.spy(updateCurrentUserAction.statusesAtom).isPending}
        trigger={
          <UserSettingOption
            title="Любимый предмет"
            imageSrc={DiamondPickaxe}
          >
            <div className="flex items-center gap-1">
              <Typography className="text-base">
                {favoriteItem ? favoriteItem.title : "не выбрано"}
              </Typography>
            </div>
          </UserSettingOption>
        }
        autoClose
        withLoader
        contentClassName="!lg:w-[600px]"
        content={
          <FavoriteItems />
        }
      />
    </>
  );
}, "FavoriteItemModal")
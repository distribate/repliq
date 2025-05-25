import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DescriptionInput } from "./components/description/description-input.tsx";
import { OutlineCover } from "./components/outline-cover/outline-cover.tsx";
import Lead from "@repo/assets/images/minecraft/lead.webp";
import { RealNameChangeModal } from "#components/modals/user-settings/components/real-name-change-modal.tsx";
import { NicknameColorPickerModal } from "#components/modals/user-settings/components/nickname-color-picker-modal.tsx";
import { FavoriteItemModal } from "#components/modals/user-settings/components/favorite-item-modal.tsx";
import { ProfileVisibilityChange } from "./components/visibility-profile/components/profile-visibility-change.tsx";
import { DateBirthdayModal } from "#components/modals/user-settings/components/date-birthday-modal.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option.tsx";
import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back.tsx";
import { reatomComponent } from "@reatom/npm-react";

export const UserProfileSettings = reatomComponent(({ ctx }) => {
  const { donate } = getUser(ctx);
  const isAccess = donate !== "default";

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack to="main" />
      <Typography variant="dialogTitle">Профиль</Typography>
      <div className="flex flex-col w-full gap-y-4">
        <DescriptionInput />
        <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
          <Typography className="text-base text-shark-200">
            Расскажи о своем возрасте или чем занимаешься?
          </Typography>
          <Typography className="text-base text-shark-200">
            Например: 20-ти летний майнкрафтер из Москвы
          </Typography>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <ProfileVisibilityChange />
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <DateBirthdayModal />
        <RealNameChangeModal />
        {isAccess && (
          <>
            <Separator className="relative bg-authentic-background brightness-150 mb-2">
              <Typography className="absolute z-2 -top-0 left-0 text-authentic-background font-[Minecraft] text-[14px]">
                only Authentic+
              </Typography>
            </Separator>
            <NicknameColorPickerModal />
            <UserSettingOption
              title="Обводка вокруг шапки профиля"
              imageSrc={Lead}
            >
              <OutlineCover />
            </UserSettingOption>
            <FavoriteItemModal />
          </>
        )}
      </div>
    </div>
  );
}, "UserProfileSettings")